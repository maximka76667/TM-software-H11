import React from "react";
import { Button } from "./ui/button";
import type { ConnectionStatus } from "@/hooks/useWebSocket";
import { toast } from "sonner";

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
  const handleDisconnect = () => {
    toast("Disconnecting from webhook server", {
      description: "Please wait while we disconnect from the webhook server",
    });
    disconnect();
  };

  const handleConnect = () => {
    toast("Connecting to webhook server", {
      description: "Please wait while we connect to the webhook server",
    });
    connect();
  };

  if (connectionStatus === "connected") {
    return <Button onClick={handleDisconnect}>Disconnect</Button>;
  }

  if (connectionStatus === "connecting") {
    return <Button disabled>Connecting...</Button>;
  }

  if (connectionStatus === "disconnected") {
    return <Button onClick={handleConnect}>Connect</Button>;
  }

  if (connectionStatus === "error") {
    return <Button disabled>Error</Button>;
  }
};

export default ConnectButton;
