import React from "react";
import { poolAbi } from "../../contract-info/abis";
import { useAccount, useContractRead, useProvider } from "wagmi";
import { type Provider } from "@wagmi/core";
import { formatUnits } from "ethers/lib/utils";

const Dashboard = () => {
  const { address } = useAccount();
  const provider = useProvider();
  return (
    <div>
      <DashboardHeader provider={provider} address={address} />
    </div>
  );
};

type DashboardHeaderProps = {
  provider: Provider | undefined;
  address: string | undefined;
};

const DashboardHeader = ({ provider, address }: DashboardHeaderProps) => {
  const { data, isError, isLoading } = useContractRead({
    address: "0x7b5C526B7F8dfdff278b4a3e045083FBA4028790",
    abi: poolAbi,
    functionName: "getUserAccountData",
    args: [address as `0x${string}`],
    enabled: !!provider && !!address,
    // watch: true,
  });

  //   console.log(data);

  const userAccountData = [
    {
      name: "totalCollateralBase",
      value:
        data?.totalCollateralBase && formatUnits(data?.totalCollateralBase, 8),
    },
    {
      name: "totalDebtBase",
      value: data?.totalDebtBase && formatUnits(data?.totalDebtBase, 8),
    },
    {
      name: "availableBorrowsBase",
      value:
        data?.availableBorrowsBase &&
        formatUnits(data?.availableBorrowsBase, 8),
    },
    {
      name: "currentLiquidationThreshold",
      value:
        data?.currentLiquidationThreshold &&
        formatUnits(data?.currentLiquidationThreshold, 2),
    },
    {
      name: "ltv",
      value: data?.ltv && formatUnits(data?.ltv, 3),
    },
    {
      name: "healthFactor",
      value: data?.healthFactor && formatUnits(data?.healthFactor, 18),
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

export default Dashboard;
