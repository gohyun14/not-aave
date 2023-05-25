import {
  ChainId,
  UiIncentiveDataProvider,
  UiPoolDataProvider,
  type ReserveDataHumanized,
} from "@aave/contract-helpers";
import {
  formatReservesAndIncentives,
  formatUserSummary,
  type FormatReserveUSDResponse,
  type FormatUserSummaryResponse,
} from "@aave/math-utils";
import { type CalculateReserveIncentivesResponse } from "@aave/math-utils/dist/esm/formatters/incentive/calculate-reserve-incentives";
import * as markets from "@bgd-labs/aave-address-book";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { useAccount, useProvider } from "wagmi";

import AssetsToBorrow from "./AssetsToBorrow";
import AssetsToSupply from "./AssetsToSupply";
import YourBorrows from "./YourBorrows";
import YourSupplies from "./YourSupplies";

const Dashboard = () => {
  const { address } = useAccount();
  const provider = useProvider();

  const [poolReserves, setPoolReserves] =
    useState<
      (FormatReserveUSDResponse &
        ReserveDataHumanized &
        Partial<CalculateReserveIncentivesResponse>)[]
    >();
  const [userSummary, setUserSummary] = useState<FormatUserSummaryResponse>();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const test = async () => {
      if (provider && address) {
        const poolDataProviderContract = new UiPoolDataProvider({
          // eslint-disable-next-line
          uiPoolDataProviderAddress: markets.AaveV3Goerli
            .UI_POOL_DATA_PROVIDER as string,
          provider,
          chainId: ChainId.goerli,
        });

        const incentiveDataProviderContract = new UiIncentiveDataProvider({
          // eslint-disable-next-line
          uiIncentiveDataProviderAddress: markets.AaveV3Goerli
            .UI_INCENTIVE_DATA_PROVIDER as string,
          provider,
          chainId: ChainId.mainnet,
        });

        // Object containing array of pool reserves and market base currency data
        // { reservesArray, baseCurrencyData }
        // reserves
        const reserves = await poolDataProviderContract.getReservesHumanized({
          // eslint-disable-next-line
          lendingPoolAddressProvider:
            // eslint-disable-next-line
            markets.AaveV3Goerli.POOL_ADDRESSES_PROVIDER,
        });

        // Array of incentive tokens with price feed and emission APR
        //reserveIncentives
        const reserveIncentives =
          await incentiveDataProviderContract.getReservesIncentivesDataHumanized(
            {
              // eslint-disable-next-line
              lendingPoolAddressProvider:
                // eslint-disable-next-line
                markets.AaveV3Goerli.POOL_ADDRESSES_PROVIDER,
            }
          );

        const reservesArray = reserves.reservesData;
        const baseCurrencyData = reserves.baseCurrencyData;

        const currentTimestamp = dayjs().unix();

        const formattedPoolReserves = formatReservesAndIncentives({
          reserves: reservesArray,
          currentTimestamp,
          marketReferenceCurrencyDecimals:
            baseCurrencyData.marketReferenceCurrencyDecimals,
          marketReferencePriceInUsd:
            baseCurrencyData.marketReferenceCurrencyPriceInUsd,
          reserveIncentives,
        });

        setPoolReserves(formattedPoolReserves);

        // Object containing array or users aave positions and active eMode category
        // { userReserves, userEmodeCategoryId }
        const userReserves =
          await poolDataProviderContract.getUserReservesHumanized({
            // eslint-disable-next-line
            lendingPoolAddressProvider:
              // eslint-disable-next-line
              markets.AaveV3Goerli.POOL_ADDRESSES_PROVIDER,
            user: address,
          });

        const userReservesArray = userReserves.userReserves;

        const formattedUserSummary = formatUserSummary({
          currentTimestamp,
          marketReferencePriceInUsd:
            baseCurrencyData.marketReferenceCurrencyPriceInUsd,
          marketReferenceCurrencyDecimals:
            baseCurrencyData.marketReferenceCurrencyDecimals,
          userReserves: userReservesArray,
          formattedReserves: formattedPoolReserves,
          userEmodeCategoryId: userReserves.userEmodeCategoryId,
        });

        setUserSummary(formattedUserSummary);
      }
    };

    test()
      .then(() => setIsLoading(false))
      .catch((err) => {
        console.log(err);
      });
  }, [address, provider]);

  console.log("poolReserves", poolReserves);
  // console.log("userSummary", userSummary);

  // const netAPY = useMemo(() => {}, []);

  const userSupplies = userSummary?.userReservesData.filter(
    (reserve) => reserve.scaledATokenBalance !== "0"
  );
  // console.log("userSuppliesFiltered", userSupplies);

  const userBorrows = userSummary?.userReservesData.filter(
    (reserve) => reserve.scaledVariableDebt !== "0"
  );
  // console.log("userReservesFiltered", userBorrows);

  return (
    <div>
      <DashboardHeader
        loading={isLoading}
        address={address}
        netWorth={
          userSummary?.netWorthUSD &&
          parseFloat(userSummary?.netWorthUSD).toFixed(2)
        }
        healthFactor={
          userSummary?.healthFactor &&
          parseFloat(userSummary?.healthFactor).toFixed(2)
        }
      />
      <div>
        <YourSupplies
          supplies={userSupplies}
          balance={
            userSummary?.totalLiquidityUSD &&
            parseFloat(userSummary?.totalLiquidityUSD).toFixed(2)
          }
        />
        <YourBorrows
          borrows={userBorrows}
          balance={
            userSummary?.totalBorrowsUSD &&
            parseFloat(userSummary?.totalBorrowsUSD).toFixed(2)
          }
        />
        <AssetsToSupply poolReserves={poolReserves} address={address} />
        <AssetsToBorrow poolReserves={poolReserves} />
      </div>
    </div>
  );
};

type DashboardHeaderProps = {
  loading: boolean;
  address: string | undefined;
  netWorth: string | undefined;
  healthFactor: string | undefined;
};

const DashboardHeader = ({
  loading,
  address,
  netWorth,
  healthFactor,
}: DashboardHeaderProps) => {
  return (
    <div className="rounded-md bg-gradient-to-r from-fuchsia-500 via-red-600 to-orange-400 p-[2px]">
      <div className="flex flex-col items-start rounded-md bg-white p-2">
        <h3 className="bg-gradient-to-r from-fuchsia-500 via-red-600 to-orange-400 bg-clip-text text-3xl font-medium text-transparent">
          {address}
        </h3>
        {loading ? (
          <div>Loading...</div>
        ) : (
          <div>
            <p>Net Worth: {netWorth}</p>
            <p>Health Factor: {healthFactor}</p>
            {/* TODO: add APY */}
            <p>Net APY: _TODO_</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
