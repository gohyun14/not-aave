import React from "react";
import { poolAbi } from "../../contract-info/abis";
import { useAccount, useContractRead, useProvider } from "wagmi";
import { type Provider } from "@wagmi/core";
import { formatUnits } from "ethers/lib/utils";
import { BigNumber } from "ethers";

const Dashboard = () => {
  const { address } = useAccount();
  const provider = useProvider();
  return (
    <div>
      <DashboardHeader provider={provider} address={address} />
      <div>
        <YourSupplies />
      </div>
    </div>
  );
};

type DashboardHeaderProps = {
  provider: Provider | undefined;
  address: string | undefined;
};

const DashboardHeader = ({ provider, address }: DashboardHeaderProps) => {
  const {
    data: contractUserAccountData,
    isError,
    isLoading,
  } = useContractRead({
    address: process.env.NEXT_PUBLIC_GOERLI_AAVE_POOL_CONTRACT as `0x${string}`,
    abi: poolAbi,
    functionName: "getUserAccountData",
    args: [address as `0x${string}`],
    enabled: !!provider && !!address,
    // watch: true,
  });

  const userAccountData = [
    {
      name: "totalCollateralBase",
      value:
        contractUserAccountData?.totalCollateralBase &&
        formatUnits(contractUserAccountData?.totalCollateralBase, 8),
      // value:
      //   contractUserAccountData?.totalCollateralBase &&
      //   formatUnits(
      //     contractUserAccountData?.totalCollateralBase,
      //     BigNumber.from("1000000000000000000000000000")
      //   ),
    },
    {
      name: "totalDebtBase",
      value:
        contractUserAccountData?.totalDebtBase &&
        formatUnits(contractUserAccountData?.totalDebtBase, 8),
    },
    {
      name: "availableBorrowsBase",
      value:
        contractUserAccountData?.availableBorrowsBase &&
        formatUnits(contractUserAccountData?.availableBorrowsBase, 8),
    },
    {
      name: "currentLiquidationThreshold",
      value:
        contractUserAccountData?.currentLiquidationThreshold &&
        formatUnits(contractUserAccountData?.currentLiquidationThreshold, 2),
    },
    {
      name: "ltv",
      value:
        contractUserAccountData?.ltv &&
        formatUnits(contractUserAccountData?.ltv, 3),
    },
    {
      name: "healthFactor",
      value:
        contractUserAccountData?.healthFactor &&
        formatUnits(contractUserAccountData?.healthFactor, 18),
    },
  ];

  return (
    <div className="rounded-md bg-gradient-to-r from-fuchsia-500 via-red-600 to-orange-400 p-[2px]">
      <div className="flex flex-col items-start rounded-md bg-zinc-700 p-2">
        <h3 className="bg-gradient-to-r from-fuchsia-500 via-red-600 to-orange-400 bg-clip-text text-3xl font-medium text-transparent">
          {address}
        </h3>
        {isLoading ? (
          <div>Loading...</div>
        ) : (
          userAccountData.map((item) => (
            <div key={item.name}>
              <p>
                {item.name} : {item.value}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

const YourSupplies = () => {
  const { data, isError, isLoading } = useContractRead({
    address: process.env.NEXT_PUBLIC_GOERLI_AAVE_POOL_CONTRACT as `0x${string}`,
    abi: poolAbi,
    functionName: "getReserveData",
    args: [process.env.NEXT_PUBLIC_GOERLI_USDC_CONTRACT as `0x${string}`],
    // watch: true,
  });

  console.log(data);

  return (
    <div>
      <h3>Your Supplies</h3>
      <div>
        <p>
          currentLiquidityRate:{" "}
          {data?.currentLiquidityRate.div(BigNumber.from(6)).toString()}
        </p>
        <p>
          currentStableBorrowRate:{" "}
          {data?.currentStableBorrowRate
            // .div("1000000000000000000000000000")
            .div(BigNumber.from(18))
            .toString()}
        </p>
        <p>
          {data?.currentStableBorrowRate &&
            formatUnits(data?.currentStableBorrowRate, BigNumber.from(27))}
        </p>
        <p>
          currentVariableBorrowRate:{" "}
          {data?.currentVariableBorrowRate
            // .div("1000000000000000000000000000")
            .div(BigNumber.from(18))
            .toString()}
        </p>
      </div>
    </div>
  );
};

export default Dashboard;
