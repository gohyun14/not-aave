import { useEffect, useState } from "react";
import {
  usePrepareContractWrite,
  useAccount,
  useSendTransaction,
  useContractRead,
  erc20ABI,
} from "wagmi";
import { BigNumber, utils } from "ethers";

const useReadBalance = (
  assetAddress: `0x${string}`,
  decimals: number,
  userAddress: `0x${string}` | undefined
) => {
  const { data: userBalance, isLoading } = useContractRead({
    address: assetAddress,
    abi: erc20ABI,
    functionName: "balanceOf",
    args: [userAddress as `0x${string}`],
    enabled: !!userAddress,
  });

  return {
    data: userBalance && utils.formatUnits(userBalance, decimals),
    isLoading,
  };
};

export default useReadBalance;
