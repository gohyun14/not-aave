import { useEffect, useState } from "react";
import { useAccount, useConnect } from "wagmi";

const ConnectWalletButton = () => {
  const { connector: activeConnector, isConnected } = useAccount();
  const { connect, connectors, error, isLoading, pendingConnector } =
    useConnect();

  return (
    <>
      {isConnected ? (
        <div>Connected to {activeConnector?.name}</div>
      ) : (
        <>
          {connectors.map((connector) => (
            <button
              disabled={!connector.ready}
              key={connector.id}
              onClick={() => {
                console.log("hi");
                connect({ connector });
              }}
            >
              {connector.name}
              {isLoading &&
                pendingConnector?.id === connector.id &&
                " (connecting)"}
            </button>
          ))}
        </>
      )}
    </>
  );
};

export default ConnectWalletButton;
