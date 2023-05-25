import { type ReserveDataHumanized } from "@aave/contract-helpers";
import { type FormatReserveUSDResponse } from "@aave/math-utils";
import { type CalculateReserveIncentivesResponse } from "@aave/math-utils/dist/esm/formatters/incentive/calculate-reserve-incentives";
import { readContract } from "@wagmi/core";
import { useEffect, useState } from "react";
import { erc20ABI } from "wagmi";

import SupplyModal from "../UI/Modal/SupplyModal";

type AssetsToSupplyProps = {
  poolReserves:
    | (FormatReserveUSDResponse &
        ReserveDataHumanized &
        Partial<CalculateReserveIncentivesResponse>)[]
    | undefined;
  address: `0x${string}` | undefined;
};

const AssetsToSupply = ({ poolReserves, address }: AssetsToSupplyProps) => {
  const [possibleSupplies, setPossibleSupplies] = useState<
    (FormatReserveUSDResponse &
      ReserveDataHumanized &
      Partial<CalculateReserveIncentivesResponse>)[]
  >([]);

  // get possible user supples (user has a balance of the reserve's underlying asset in their wallet)
  useEffect(() => {
    const getBalances = () => {
      return poolReserves
        ? poolReserves?.map(async (reserve) => {
            const balance = await readContract({
              address: reserve.underlyingAsset as `0x${string}`,
              abi: erc20ABI,
              functionName: "balanceOf",
              args: [address as `0x${string}`],
            });

            return {
              asset: reserve.underlyingAsset,
              balance: balance.toString(),
            };
          })
        : [];
    };

    const setBalances = async () => {
      const balances = await Promise.all(getBalances());
      const filteredBalances = poolReserves?.filter((reserve) => {
        const balance = balances.find(
          (balance) => balance.asset === reserve.underlyingAsset
        );

        return balance?.balance !== "0";
      });
      setPossibleSupplies(filteredBalances ?? []);
    };

    if (poolReserves && poolReserves.length > 0 && !!address) {
      void setBalances();
    }
  }, [poolReserves, address]);

  return (
    <div className="rounded-md bg-gradient-to-r from-fuchsia-500 via-red-600 to-orange-400 p-[2px]">
      <div className="flex flex-col items-start rounded-md bg-zinc-700 p-2">
        <h3 className="mb-8">Assets to Supply</h3>
        <ul className="flex flex-col gap-y-4">
          {possibleSupplies?.map((asset) => (
            <li key={asset.underlyingAsset}>
              <AssetSupplyItem asset={asset} />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AssetsToSupply;

type AssetSupplyItemProps = {
  asset: FormatReserveUSDResponse &
    ReserveDataHumanized &
    Partial<CalculateReserveIncentivesResponse>;
};

const AssetSupplyItem = ({ asset }: AssetSupplyItemProps) => {
  const [isSupplyModalOpen, setIsSupplyModalOpen] = useState(false);

  return (
    <>
      <div>
        <div className="flex flex-row gap-x-4">
          <p>reserve: {asset.name}</p>
          <p>supply apy: {asset.supplyAPY}</p>
        </div>
        <div>
          <button onClick={() => setIsSupplyModalOpen(true)}>Supply</button>
        </div>
      </div>
      {isSupplyModalOpen && (
        <SupplyModal
          closeModal={() => setIsSupplyModalOpen(false)}
          asset={asset}
        />
      )}
    </>
  );
};

//stableBorrowRateEnabled
