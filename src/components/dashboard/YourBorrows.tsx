import {
  type ComputedUserReserve,
  type FormatReserveUSDResponse,
} from "@aave/math-utils";
import { useState } from "react";

import BorrowModal from "../UI/Modal/BorrowModal";
import RepayModal from "../UI/Modal/RepayModal";

type YourBorrowsProps = {
  borrows: ComputedUserReserve<FormatReserveUSDResponse>[] | undefined;
  balance: string | undefined;
};

const YourBorrows = ({ borrows, balance }: YourBorrowsProps) => {
  return (
    <div className="rounded-md bg-gradient-to-r from-fuchsia-500 via-red-600 to-orange-400 p-[2px]">
      <div className="flex flex-col items-start rounded-md bg-zinc-700 p-2">
        <h3>Your Borrows</h3>
        <p>balance: {balance}</p>
        <ul>
          {borrows?.map((asset) => (
            <li key={asset.underlyingAsset} className="flex flex-row gap-x-4">
              <BorrowItem asset={asset} />
            </li>
          ))}
        </ul>
      </div>
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

  return (
    <>
      <div>
        <div className="flex flex-row gap-x-4">
          <p>reserve: {asset.reserve.name}</p>
          <p>balance: {asset.totalBorrows}</p>
          <p>balanceUSD: {asset.totalBorrowsUSD}</p>
          <p>borrow apy: {asset.reserve.variableBorrowAPY}</p>
        </div>
        <div>
          <button onClick={() => setIsRepayModalOpen(true)}>Repay</button>
          <button onClick={() => setIsBorrowModalOpen(true)}>Borrow</button>
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
          asset={asset}
        />
      )}
    </>
  );
};
