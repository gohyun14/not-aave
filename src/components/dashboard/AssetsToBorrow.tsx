import { type ReserveDataHumanized } from "@aave/contract-helpers";
import { type FormatReserveUSDResponse } from "@aave/math-utils";
import { type CalculateReserveIncentivesResponse } from "@aave/math-utils/dist/esm/formatters/incentive/calculate-reserve-incentives";
import { readContract } from "@wagmi/core";
import { useEffect, useState } from "react";
import { erc20ABI } from "wagmi";

import BorrowModal from "../UI/Modal/BorrowModal";

type AssetsToBorrowProps = {
  poolReserves:
    | (FormatReserveUSDResponse &
        ReserveDataHumanized &
        Partial<CalculateReserveIncentivesResponse>)[]
    | undefined;
};

const AssetsToBorrow = ({ poolReserves }: AssetsToBorrowProps) => {
  return (
    <div className="rounded-md bg-gradient-to-r from-fuchsia-500 via-red-600 to-orange-400 p-[2px]">
      <div className="flex flex-col items-start rounded-md bg-zinc-700 p-2">
        <h3 className="mb-8">Assets to Borrow</h3>
        <ul className="flex flex-col gap-y-4">
          {poolReserves
            ?.filter((reserve) => reserve.variableBorrowRate !== "0")
            .map((asset) => (
              <li key={asset.underlyingAsset}>
                <AssetBorrowItem asset={asset} />
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
};

export default AssetsToBorrow;

type AssetBorrowItemProps = {
  asset: FormatReserveUSDResponse &
    ReserveDataHumanized &
    Partial<CalculateReserveIncentivesResponse>;
};

const AssetBorrowItem = ({ asset }: AssetBorrowItemProps) => {
  const [isSupplyModalOpen, setIsSupplyModalOpen] = useState(false);

  return (
    <>
      <div>
        <div className="flex flex-row gap-x-4">
          <p>reserve: {asset.name}</p>
          <p>supply apy: {asset.supplyAPY}</p>
        </div>
        <div>
          <button onClick={() => setIsSupplyModalOpen(true)}>Borrow</button>
        </div>
      </div>
      {isSupplyModalOpen && (
        <BorrowModal
          closeModal={() => setIsSupplyModalOpen(false)}
          asset={asset}
        />
      )}
    </>
  );
};
