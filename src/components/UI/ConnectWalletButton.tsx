import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { useQuery } from "@tanstack/react-query";
import { useAccount, useConnect } from "wagmi";

const ConnectWalletButton = () => {
  const { connector: activeConnector, isConnected } = useAccount();
  const { connect, connectors, error, isLoading, pendingConnector } =
    useConnect();

  return (
    <>
      {isConnected && <div>Connected to {activeConnector?.name}</div>}

      {connectors.map((connector) => (
        <button
          disabled={!connector.ready}
          key={connector.id}
          onClick={() => connect({ connector })}
        >
          {connector.name}
          {isLoading &&
            pendingConnector?.id === connector.id &&
            " (connecting)"}
        </button>
      ))}
    </>
  );
};

export default ConnectWalletButton;
