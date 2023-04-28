import React, { useEffect, useState } from "react";
import { poolAbi } from "../../contract-info/abis";
import { useAccount, useContractRead, useProvider } from "wagmi";
import { formatUnits } from "ethers/lib/utils";
import { BigNumber } from "ethers";
import {
  UiPoolDataProvider,
  UiIncentiveDataProvider,
  ChainId,
  type ReserveDataHumanized,
} from "@aave/contract-helpers";
import {
  formatReservesAndIncentives,
  formatUserSummary,
  type FormatUserSummaryResponse,
  type FormatReserveUSDResponse,
} from "@aave/math-utils";
import { type CalculateReserveIncentivesResponse } from "@aave/math-utils/dist/esm/formatters/incentive/calculate-reserve-incentives";
import * as markets from "@bgd-labs/aave-address-book";
import dayjs from "dayjs";

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

  // console.log("poolReserves", poolReserves);
  console.log("userSummary", userSummary);

  return (
    <div>
      <DashboardHeader loading={isLoading} address={address} />
      <div>{/* <YourSupplies /> */}</div>
    </div>
  );
};

type DashboardHeaderProps = {
  loading: boolean;
  address: string | undefined;
};

const DashboardHeader = ({ loading, address }: DashboardHeaderProps) => {
  return (
    <div className="rounded-md bg-gradient-to-r from-fuchsia-500 via-red-600 to-orange-400 p-[2px]">
      <div className="flex flex-col items-start rounded-md bg-zinc-700 p-2">
        <h3 className="bg-gradient-to-r from-fuchsia-500 via-red-600 to-orange-400 bg-clip-text text-3xl font-medium text-transparent">
          {address}
        </h3>
        {loading ? (
          <div>Loading...</div>
        ) : (
          <div>
            <p>hi</p>
          </div>
        )}
      </div>
    </div>
  );
};

const YourSupplies = () => {
  const { data, isError, isLoading } = useContractRead({
    address: process.env.NEXT_PUBLIC_GOERLI_AAVE_POOL_CONTRACT as `0x${string}`,
    abi: poolAbi,
    functionName: "getReserveData",
    args: [process.env.NEXT_PUBLIC_GOERLI_USDC_CONTRACT as `0x${string}`],
    // watch: true,
  });

  console.log(data);

  return (
    <div>
      <h3>Your Supplies</h3>
      <div>
        <p>
          currentLiquidityRate:{" "}
          {data?.currentLiquidityRate.div(BigNumber.from(6)).toString()}
        </p>
        <p>
          currentStableBorrowRate:{" "}
          {data?.currentStableBorrowRate
            // .div("1000000000000000000000000000")
            .div(BigNumber.from(18))
            .toString()}
        </p>
        <p>
          {data?.currentStableBorrowRate &&
            formatUnits(data?.currentStableBorrowRate, BigNumber.from(27))}
        </p>
        <p>
          currentVariableBorrowRate:{" "}
          {data?.currentVariableBorrowRate
            // .div("1000000000000000000000000000")
            .div(BigNumber.from(18))
            .toString()}
        </p>
      </div>
    </div>
  );
};

export default Dashboard;
