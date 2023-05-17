import { utils } from "ethers";
import { erc20ABI, useContractRead } from "wagmi";

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
    data:
      userBalance &&
      Number(parseFloat(utils.formatUnits(userBalance, decimals)).toFixed(2)),
    isLoading,
  };
};

export default useReadBalance;
