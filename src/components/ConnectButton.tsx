import { Button } from "./ui/button";

import type { ConnectionStatus } from "@/types/ConnectionsStatus";

interface ConnectButtonProps {
  connectionStatus: ConnectionStatus;
  disconnect: () => void;
  connect: () => void;
}

const ConnectButton = ({
  connectionStatus,
  disconnect,
  connect,
}: ConnectButtonProps) => {
  if (connectionStatus === "connected") {
    return <Button onClick={disconnect}>Disconnect</Button>;
  }

  if (connectionStatus === "connecting") {
    return <Button disabled>Connecting...</Button>;
  }

  if (connectionStatus === "disconnected") {
    return <Button onClick={connect}>Connect</Button>;
  }

  if (connectionStatus === "error") {
    return <Button disabled>Error</Button>;
  }
};

export default ConnectButton;
