import { useState, type ChangeEvent } from "react";
import { poolAbi } from "../../../contract-info/abis";
import { BigNumber, utils } from "ethers";
import {
  type FormatReserveUSDResponse,
  type ComputedUserReserve,
} from "@aave/math-utils";
import { usePrepareContractWrite, useAccount } from "wagmi";

import Modal from "./Modal";

type WithdrawModalProps = {
  closeModal: () => void;
  asset: ComputedUserReserve<FormatReserveUSDResponse>;
};

const WithdrawModal = ({ closeModal, asset }: WithdrawModalProps) => {
  const { address } = useAccount();

  const [amount, setAmount] = useState<number>(10);
  const [errorMessage, setErrorMessage] = useState(""); //TODO: amount validation

  const { config } = usePrepareContractWrite({
    address: process.env.NEXT_PUBLIC_GOERLI_AAVE_POOL_CONTRACT as `0x${string}`,
    abi: poolAbi,
    functionName: "withdraw",
    args: [
      asset.underlyingAsset as `0x${string}`,
      utils.parseUnits(amount.toString(), asset.reserve.decimals),
      address as `0x${string}`,
    ],
    enabled: !!address && amount <= parseFloat(asset.underlyingBalance),
  });

  return (
    <Modal closeModal={closeModal}>
      <div className="text-zinc-900">
        <h1>WithdrawModal</h1>
        <div className="flex flex-col">
          <label>Amount</label>
          <input
            value={amount ?? ""}
            onChange={(e) => setAmount(parseFloat(e.target.value))}
            className="border"
          />
          {errorMessage && <p>{errorMessage}</p>}
        </div>
      </div>
    </Modal>
  );
};

export default WithdrawModal;
