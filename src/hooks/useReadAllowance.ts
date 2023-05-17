import { utils } from "ethers";
import { erc20ABI, useContractRead } from "wagmi";

const useReadAllowance = (
  assetAddress: `0x${string}`,
  userAddress: `0x${string}` | undefined,
  decimals: number
) => {
  const { data, isLoading } = useContractRead({
    address: assetAddress,
    abi: erc20ABI,
    functionName: "allowance",
    args: [
      userAddress as `0x${string}`,
      process.env.NEXT_PUBLIC_GOERLI_AAVE_POOL_CONTRACT as `0x${string}`,
    ],
    enabled: !!userAddress,
    watch: true,
  });

  return {
    data: data && Number(utils.formatUnits(data, decimals)),
    isLoading,
  };
};

export default useReadAllowance;
