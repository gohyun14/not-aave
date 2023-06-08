import { type ReserveDataHumanized } from "@aave/contract-helpers";
import { type FormatReserveUSDResponse } from "@aave/math-utils";
import { type CalculateReserveIncentivesResponse } from "@aave/math-utils/dist/esm/formatters/incentive/calculate-reserve-incentives";
import { readContract } from "@wagmi/core";
import { useEffect, useState, useMemo } from "react";
import { erc20ABI } from "wagmi";
import { utils } from "ethers";

import SupplyModal from "../UI/Modal/SupplyModal";
import Button from "../UI/Button";

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

  const walletBalances = useMemo(() => new Map<string, string>(), []);

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

            walletBalances.set(
              reserve.underlyingAsset,
              utils.formatUnits(balance, reserve.decimals)
            );

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
  }, [poolReserves, address, walletBalances]);

  return (
    <div className="flex flex-col items-start rounded-md p-2">
      <h3 className="mb-8">Assets to Supply</h3>
      <ul className="flex flex-row flex-wrap gap-x-4 gap-y-4">
        {possibleSupplies?.map((asset) => (
          <li key={asset.underlyingAsset}>
            <AssetSupplyItem
              asset={asset}
              walletBalance={walletBalances.get(asset.underlyingAsset) ?? "0"}
            />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AssetsToSupply;

type AssetSupplyItemProps = {
  asset: FormatReserveUSDResponse &
    ReserveDataHumanized &
    Partial<CalculateReserveIncentivesResponse>;
  walletBalance: string;
};

const AssetSupplyItem = ({ asset, walletBalance }: AssetSupplyItemProps) => {
  const [isSupplyModalOpen, setIsSupplyModalOpen] = useState(false);

  const assetAPY = useMemo(() => {
    const supplyAPY = Number(asset.supplyAPY) * 100;
    if (supplyAPY == 0) return "0";
    if (supplyAPY < 0.01) return "< 0.01";
    return supplyAPY.toFixed(2);
  }, [asset.supplyAPY]);

  return (
    <>
      <div className="w-52 rounded-md border border-zinc-300 bg-white p-5 shadow-md transition-colors duration-300 hover:border-zinc-400 hover:shadow-lg">
        <div className="">
          <p className="text-2xl font-medium">{asset.name}</p>
          <p className="mt-2 text-lg text-zinc-800">
            {Number(walletBalance).toFixed(2)}
          </p>
          <p className="-mt-1 text-xs text-zinc-500">Wallet balance</p>
          <p className="mt-2 text-lg text-zinc-800">
            {assetAPY}
            <span className="ml-1 text-sm">%</span>
          </p>
          <p className="-mt-1 text-xs text-zinc-500">APY</p>
        </div>
        <div className="mt-8 flex flex-row justify-end gap-x-2">
          <Button onClick={() => setIsSupplyModalOpen(true)}>Supply</Button>
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
