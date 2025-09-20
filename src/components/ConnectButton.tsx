import type { ComponentProps } from "react";
import { Button } from "./ui/button";

import type { ConnectionStatus } from "@/types/ConnectionsStatus";

interface ConnectButtonProps
  extends Omit<
    ComponentProps<typeof Button>,
    "onClick" | "disabled" | "children"
  > {
  connectionStatus: ConnectionStatus;
  disconnect: () => void;
  connect: () => void;
}

const ConnectButton = ({
  connectionStatus,
  disconnect,
  connect,
  ...props
}: ConnectButtonProps) => {
  if (connectionStatus === "connected") {
    return (
      <Button onClick={disconnect} {...props}>
        Disconnect
      </Button>
    );
  }

  if (connectionStatus === "connecting") {
    return (
      <Button disabled {...props}>
        Connecting...
      </Button>
    );
  }

  if (connectionStatus === "disconnected") {
    return (
      <Button onClick={connect} {...props}>
        Connect
      </Button>
    );
  }

  if (connectionStatus === "error") {
    return (
      <Button onClick={connect} {...props}>
        Retry
      </Button>
    );
  }
};

export default ConnectButton;
