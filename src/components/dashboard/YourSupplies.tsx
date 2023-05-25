import {
  type ComputedUserReserve,
  type FormatReserveUSDResponse,
} from "@aave/math-utils";
import { useState } from "react";

import SupplyModal from "../UI/Modal/SupplyModal";
import WithdrawModal from "../UI/Modal/WithdrawModal";

type YourSuppliesProps = {
  supplies: ComputedUserReserve<FormatReserveUSDResponse>[] | undefined;
  balance: string | undefined;
};

const YourSupplies = ({ supplies, balance }: YourSuppliesProps) => {
  return (
    <div className="rounded-md bg-gradient-to-r from-fuchsia-500 via-red-600 to-orange-400 p-[2px]">
      <div className="flex flex-col items-start rounded-md bg-zinc-700 p-2">
        <h3>Your Supplies</h3>
        <p className="mb-8">Total supply balance: {balance}</p>
        <ul className="flex flex-col gap-y-4">
          {supplies?.map((asset) => (
            <li key={asset.underlyingAsset}>
              <SupplyItem asset={asset} />
            </li>
          ))}
        </ul>
      </div>
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

  return (
    <>
      <div>
        <div className="flex flex-row gap-x-4">
          <p>reserve: {asset.reserve.name}</p>
          <p>balance: {asset.underlyingBalance}</p>
          <p>balanceUSD: {asset.underlyingBalanceUSD}</p>
          <p>supply apy: {asset.reserve.supplyAPY}</p>
        </div>
        <div>
          <button onClick={() => setIsWithdrawModalOpen(true)}>Withdraw</button>
          <button onClick={() => setIsSupplyModalOpen(true)}>Supply</button>
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
