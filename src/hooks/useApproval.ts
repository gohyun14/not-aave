import { utils } from "ethers";
import {
  erc20ABI,
  useContractRead,
  usePrepareContractWrite,
  useContractWrite,
} from "wagmi";
import useReadAllowance from "./useReadAllowance";

const useApproval = (
  assetAddress: `0x${string}`,
  userAddress: `0x${string}` | undefined,
  decimals: number,
  amount: number
) => {
  // get user allowance
  const { data: userApprovalData } = useReadAllowance(
    assetAddress,
    userAddress,
    decimals
  );

  // set allowance transaction logic
  const { config: allowanceConfig } = usePrepareContractWrite({
    address: assetAddress,
    abi: erc20ABI,
    functionName: "approve",
    args: [
      process.env.NEXT_PUBLIC_GOERLI_AAVE_POOL_CONTRACT as `0x${string}`,
      utils.parseUnits(amount.toString(), decimals),
    ],
    enabled: !!userAddress && !!userApprovalData && amount > 0,
  });

  const {
    data: allowanceTransactionData,
    isLoading: isAllowanceTransactionSending,
    write: sendAllowanceTransaction,
    error: allowanceTransactionError,
    isSuccess: isAllowanceTransactionSuccess,
  } = useContractWrite(allowanceConfig);

  return {
    isAllowed:
      userApprovalData !== undefined && userApprovalData >= amount
        ? true
        : false,
    isAllowanceTransactionSending,
    sendAllowanceTransaction,
  };
};

export default useApproval;
