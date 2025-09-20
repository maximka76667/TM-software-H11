import { Button } from "./ui/button";
import type { ConnectionStatus } from "@/hooks/useWebSocket";
import { toast } from "sonner";
import { TOAST_DESCRIPTIONS, TOAST_MESSAGES } from "@/constants/messages";

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
    toast(TOAST_MESSAGES.DISCONNECTING, {
      description: TOAST_DESCRIPTIONS.DISCONNECTING,
    });
    disconnect();
  };

  const handleConnect = () => {
    toast(TOAST_MESSAGES.CONNECTING, {
      description: TOAST_DESCRIPTIONS.CONNECTING,
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
