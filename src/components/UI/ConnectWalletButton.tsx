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
        <div className="flex flex-row gap-x-[8px]">
          {connectors.map((connector) => (
            <button
              disabled={!connector.ready}
              key={connector.id}
              onClick={() => {
                console.log("hi");
                connect({ connector });
              }}
              className="hover:cursor-pointer disabled:hover:cursor-not-allowed"
            >
              {connector.name}
              {isLoading &&
                pendingConnector?.id === connector.id &&
                " (connecting)"}
            </button>
          ))}
        </div>
      )}
    </>
  );
};

export default ConnectWalletButton;
