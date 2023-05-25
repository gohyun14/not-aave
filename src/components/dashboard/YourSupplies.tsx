import {
  type ComputedUserReserve,
  type FormatReserveUSDResponse,
} from "@aave/math-utils";
import { useState, useMemo } from "react";

import SupplyModal from "../UI/Modal/SupplyModal";
import WithdrawModal from "../UI/Modal/WithdrawModal";
import Button from "../UI/Button";

type YourSuppliesProps = {
  supplies: ComputedUserReserve<FormatReserveUSDResponse>[] | undefined;
  balance: string | undefined;
};

const YourSupplies = ({ supplies, balance }: YourSuppliesProps) => {
  return (
    <div className="flex flex-col items-start rounded-md p-2">
      <h3>Your Supplies</h3>
      <p className="mb-8">Total supply balance: {balance}</p>
      <ul className="flex flex-row flex-wrap gap-x-4 gap-y-4">
        {supplies?.map((asset) => (
          <li key={asset.underlyingAsset}>
            <SupplyItem asset={asset} />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default YourSupplies;

type SupplyItemProps = {
  asset: ComputedUserReserve<FormatReserveUSDResponse>;
};

const SupplyItem = ({ asset }: SupplyItemProps) => {
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const [isSupplyModalOpen, setIsSupplyModalOpen] = useState(false);

  const assetAPY = useMemo(() => {
    const supplyAPY = Number(asset.reserve.supplyAPY);
    if (supplyAPY == 0) return "0 %";
    if (supplyAPY < 0.01) return "< 0.01 %";
    return supplyAPY.toFixed(2);
  }, [asset.reserve.supplyAPY]);

  return (
    <>
      <div className="w-52 rounded-md border border-zinc-300 bg-white p-5 shadow-md transition-colors duration-300 hover:border-zinc-400 hover:shadow-lg">
        <div className="">
          <p className="text-2xl font-medium">{asset.reserve.name}</p>
          <div className="mt-2 flex flex-row items-end gap-x-2">
            <p className="text-lg text-zinc-800">
              {Number(asset.underlyingBalance).toFixed(2)}
            </p>
            <p className="mb-1 text-xs font-light text-zinc-700">
              ${Number(asset.underlyingBalanceUSD).toFixed(2)}
            </p>
          </div>

          <p className="-mt-1 text-xs text-zinc-500">Balance</p>
          <p className="mt-2 text-lg text-zinc-800">{assetAPY}</p>
          <p className="-mt-1 text-xs text-zinc-500">APY</p>
        </div>
        <div className="mt-8 flex flex-row justify-end gap-x-2">
          <Button onClick={() => setIsWithdrawModalOpen(true)}>Withdraw</Button>
          <Button onClick={() => setIsSupplyModalOpen(true)} secondary>
            Supply
          </Button>
        </div>
      </div>
      {isWithdrawModalOpen && (
        <WithdrawModal
          closeModal={() => setIsWithdrawModalOpen(false)}
          asset={asset}
        />
      )}
      {isSupplyModalOpen && (
        <SupplyModal
          closeModal={() => setIsSupplyModalOpen(false)}
          asset={asset.reserve}
        />
      )}
    </>
  );
};
