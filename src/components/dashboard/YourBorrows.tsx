import {
  type ComputedUserReserve,
  type FormatReserveUSDResponse,
} from "@aave/math-utils";
import { useState, useMemo } from "react";

import BorrowModal from "../UI/Modal/BorrowModal";
import RepayModal from "../UI/Modal/RepayModal";
import Button from "../UI/Button";

type YourBorrowsProps = {
  borrows: ComputedUserReserve<FormatReserveUSDResponse>[] | undefined;
  balance: string | undefined;
};

const YourBorrows = ({ borrows, balance }: YourBorrowsProps) => {
  return (
    <div className="flex flex-col items-start rounded-md p-2">
      <h3>Your Borrows</h3>
      <p className="mb-8">Total debt balance: ${balance}</p>
      <ul className="flex flex-row flex-wrap gap-x-4 gap-y-4">
        {borrows?.map((asset) => (
          <li key={asset.underlyingAsset}>
            <BorrowItem asset={asset} />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default YourBorrows;

type BorrowItemProps = {
  asset: ComputedUserReserve<FormatReserveUSDResponse>;
};

const BorrowItem = ({ asset }: BorrowItemProps) => {
  const [isRepayModalOpen, setIsRepayModalOpen] = useState(false);
  const [isBorrowModalOpen, setIsBorrowModalOpen] = useState(false);

  const assetAPY = useMemo(() => {
    const borrowAPY = Number(asset.reserve.variableBorrowAPY) * 100;
    if (borrowAPY == 0) return "0";
    if (borrowAPY < 0.01) return "< 0.01";
    return borrowAPY.toFixed(2);
  }, [asset.reserve.variableBorrowAPY]);

  return (
    <>
      <div className="w-52 rounded-md border border-zinc-300 bg-white p-5 shadow-md transition-colors duration-300 hover:border-zinc-400 hover:shadow-lg">
        <div className="">
          <p className="text-2xl font-medium">{asset.reserve.name}</p>
          <div className="mt-2 flex flex-row items-end gap-x-2">
            <p className="text-lg text-zinc-800">
              {Number(asset.totalBorrows).toFixed(2)}
            </p>
            <p className="mb-1 text-xs font-light text-zinc-700">
              ${Number(asset.totalBorrowsUSD).toFixed(2)}
            </p>
          </div>

          <p className="-mt-1 text-xs text-zinc-500">Debt</p>
          <p className="mt-2 text-lg text-zinc-800">
            {assetAPY}
            <span className="ml-1 text-sm">%</span>
          </p>
          <p className="-mt-1 text-xs text-zinc-500">APY</p>
        </div>
        <div className="mt-8 flex flex-row justify-end gap-x-2">
          <Button onClick={() => setIsRepayModalOpen(true)}>Repay</Button>
          <Button onClick={() => setIsBorrowModalOpen(true)} secondary>
            Borrow
          </Button>
        </div>
      </div>
      {isRepayModalOpen && (
        <RepayModal
          closeModal={() => setIsRepayModalOpen(false)}
          asset={asset}
        />
      )}
      {isBorrowModalOpen && (
        <BorrowModal
          closeModal={() => setIsBorrowModalOpen(false)}
          asset={asset.reserve}
        />
      )}
    </>
  );
};
