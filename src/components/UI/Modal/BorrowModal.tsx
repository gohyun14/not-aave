import { useState, type ChangeEvent } from "react";
import { poolAbi } from "../../../contract-info/abis";
import { BigNumber, utils } from "ethers";
import { type ReserveDataHumanized } from "@aave/contract-helpers";
import { type FormatReserveUSDResponse } from "@aave/math-utils";
import { type CalculateReserveIncentivesResponse } from "@aave/math-utils/dist/esm/formatters/incentive/calculate-reserve-incentives";
import {
  usePrepareContractWrite,
  useAccount,
  useSendTransaction,
  useWaitForTransaction,
} from "wagmi";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  ArrowRightIcon,
  ArrowTopRightOnSquareIcon,
} from "@heroicons/react/20/solid";

import Modal from "./Modal";

const FormSchema = z.object({
  amount: z
    .number({
      invalid_type_error: "Amount is required.",
    })
    .gt(0, { message: "Must be greater than 0." }),
});

export type FormSchemaType = {
  amount: number | undefined;
};

type BorrowModalProps = {
  closeModal: () => void;
  asset:
    | (FormatReserveUSDResponse &
        ReserveDataHumanized &
        Partial<CalculateReserveIncentivesResponse>)
    | FormatReserveUSDResponse;
};

const BorrowModal = ({ closeModal, asset }: BorrowModalProps) => {
  const { address } = useAccount();

  const [amount, setAmount] = useState<number>(0);
  const [errorMessage, setErrorMessage] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormSchemaType>({
    //eslint-disable-next-line
    resolver: zodResolver(FormSchema),
    defaultValues: {
      amount: undefined,
    },
  });

  const { onChange, onBlur, name, ref } = register("amount", {
    required: true,
    valueAsNumber: true,
  });

  const { config } = usePrepareContractWrite({
    address: process.env.NEXT_PUBLIC_GOERLI_AAVE_POOL_CONTRACT as `0x${string}`,
    abi: poolAbi,
    functionName: "borrow",
    args: [
      asset.underlyingAsset as `0x${string}`,
      utils.parseUnits(amount.toString(), asset.decimals),
      BigNumber.from(2),
      0,
      address as `0x${string}`,
    ],
    enabled:
      !!address &&
      errorMessage === "" &&
      errors.amount === undefined &&
      amount > 0,
  });

  const {
    data: sendTransactionData,
    isLoading: isTransactionSending,
    sendTransaction,
    error: sendTransactionError,
    isSuccess: isSendTransactionSuccess,
  } = useSendTransaction({
    ...config,
    onSuccess: () => {
      reset();
      setAmount(0);
    },
  });

  const onSubmit = (data: FormSchemaType) => {
    if (data.amount && errorMessage === "") {
      setErrorMessage("");
      sendTransaction?.();
    }
  };

  return (
    <Modal closeModal={closeModal}>
      <form
        // eslint-disable-next-line
        onSubmit={handleSubmit(onSubmit)}
        action="#"
        method="POST"
        className="text-zinc-900"
      >
        <h1>Borrow {asset.name}</h1>
        <div className="flex flex-col">
          <label
            htmlFor="last-name"
            className="block text-base font-medium text-gray-700"
          >
            Amount
          </label>
          <input
            type="text"
            id="amount"
            onChange={(e) => {
              setErrorMessage("");
              void onChange(e);
              if (parseFloat(e.target.value)) {
                setAmount(parseFloat(e.target.value));
              }
              // if (
              //   parseFloat(e.target.value) > parseFloat(asset.underlyingBalance)
              // ) {
              //   setErrorMessage("This amount exceeds your balance.");
              // }
            }}
            onBlur={void onBlur}
            name={name}
            ref={ref}
            className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm sm:text-sm"
          />

          <AnimatePresence>
            {(errors.amount || errorMessage !== "") && (
              <motion.p
                initial={{ height: 0, opacity: 0 }}
                animate={{
                  opacity: 1,
                  height: "auto",
                  transition: { duration: 0.1 },
                }}
                exit={{
                  height: 0,
                  opacity: 0,
                  transition: { duration: 0.1 },
                }}
                className="mt-[2px] text-xs text-red-600"
              >
                {errors.amount ? errors?.amount?.message : errorMessage}
              </motion.p>
            )}
          </AnimatePresence>
        </div>
        <motion.button
          disabled={errors.amount !== undefined || errorMessage !== ""}
          type="submit"
          className="mt-1 flex flex-row items-center justify-center rounded-full bg-fuchsia-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-fuchsia-500 disabled:cursor-not-allowed disabled:bg-zinc-400"
          whileTap={{
            scale: 0.95,
            borderRadius: "8px",
          }}
          transition={{
            type: "spring",
            stiffness: 150,
            damping: 8,
            mass: 0.5,
          }}
        >
          {isTransactionSending ? "Borrowing" : "Borrow"}
          {isTransactionSending && (
            <svg className="ml-1 h-4 w-4 animate-spin rounded-full border-2 border-t-fuchsia-800 text-fuchsia-200" />
          )}
        </motion.button>
      </form>
      {(sendTransactionError || isSendTransactionSuccess) &&
        (sendTransactionError ? (
          <motion.div
            className="flex flex-col items-start justify-center rounded-lg bg-red-100 p-2 text-red-600 shadow-sm hover:cursor-pointer"
            variants={{
              hidden: { opacity: 0, height: 0 },
              visible: {
                opacity: 1,
                height: "auto",
                transition: {
                  duration: 0.15,
                  ease: "easeInOut",
                },
              },
            }}
            initial="hidden"
            animate="visible"
          >
            <h3 className="text-lg font-medium">Error!</h3>
            <p className="text-sm">
              There was an error with your transaction. Please check your
              connection, the amount and try again.
            </p>
          </motion.div>
        ) : (
          <motion.a
            href={`https://sepolia.etherscan.io/tx/${
              sendTransactionData?.hash as string
            }`}
            target="_blank"
            className="flex flex-col items-start justify-center rounded-lg bg-fuchsia-100 p-2 text-fuchsia-800 shadow-sm hover:cursor-pointer hover:bg-fuchsia-200"
            variants={{
              hidden: { opacity: 0, height: 0 },
              visible: {
                opacity: 1,
                height: "auto",
                transition: {
                  duration: 0.15,
                  ease: "easeInOut",
                },
              },
            }}
            initial="hidden"
            animate="visible"
          >
            <div className="flex w-full flex-row items-center justify-between">
              <h3 className="text-lg font-medium">Success!</h3>
              <ArrowTopRightOnSquareIcon className="h-5 w-5" />
            </div>
            <p className="text-sm">
              Your transaction has been sent! Click here to view the transaction
              in Etherscan.
            </p>
          </motion.a>
        ))}
    </Modal>
  );
};

export default BorrowModal;
