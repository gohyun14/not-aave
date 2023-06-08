import { type ReserveDataHumanized } from "@aave/contract-helpers";
import { type FormatReserveUSDResponse } from "@aave/math-utils";
import { type CalculateReserveIncentivesResponse } from "@aave/math-utils/dist/esm/formatters/incentive/calculate-reserve-incentives";
import { useState, useMemo } from "react";

import BorrowModal from "../UI/Modal/BorrowModal";
import Button from "../UI/Button";

type AssetsToBorrowProps = {
  poolReserves:
    | (FormatReserveUSDResponse &
        ReserveDataHumanized &
        Partial<CalculateReserveIncentivesResponse>)[]
    | undefined;
};

const AssetsToBorrow = ({ poolReserves }: AssetsToBorrowProps) => {
  return (
    <div className="flex flex-col items-start rounded-md p-2">
      <h3 className="mb-8">Assets to Borrow</h3>
      <ul className="flex flex-row flex-wrap gap-x-4 gap-y-4">
        {poolReserves
          ?.filter((reserve) => reserve.variableBorrowRate !== "0")
          .map((asset) => (
            <li key={asset.underlyingAsset}>
              <AssetBorrowItem asset={asset} />
            </li>
          ))}
      </ul>
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
  const [isBorrowModalOpen, setIsBorrowModalOpen] = useState(false);

  const assetAPY = useMemo(() => {
    const borrowAPY = Number(asset.variableBorrowAPY) * 100;
    if (borrowAPY == 0) return "0";
    if (borrowAPY < 0.01) return "< 0.01";
    return borrowAPY.toFixed(2);
  }, [asset.variableBorrowAPY]);

  return (
    <>
      <div className="w-52 rounded-md border border-zinc-300 bg-white p-5 shadow-md transition-colors duration-300 hover:border-zinc-400 hover:shadow-lg">
        <div className="">
          <p className="text-2xl font-medium">{asset.name}</p>
          <p className=" mt-2 text-lg text-zinc-800">
            {(Number(asset.borrowUsageRatio) * 100).toFixed(2)}
            <span className="ml-1 text-sm">%</span>
          </p>

          <p className="-mt-1 text-xs text-zinc-500">Usage</p>
          <p className="mt-2 text-lg text-zinc-800">
            {assetAPY}
            <span className="ml-1 text-sm">%</span>
          </p>
          <p className="-mt-1 text-xs text-zinc-500">APY</p>
        </div>
        <div className="mt-8 flex flex-row justify-end gap-x-2">
          <Button onClick={() => setIsBorrowModalOpen(true)}>Borrow</Button>
        </div>
      </div>
      {isBorrowModalOpen && (
        <BorrowModal
          closeModal={() => setIsBorrowModalOpen(false)}
          asset={asset}
        />
      )}
    </>
  );
};
