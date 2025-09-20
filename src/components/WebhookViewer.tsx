import { useWebSocket } from "../hooks/useWebSocket";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import ConnectButton from "./ConnectButton";
import { toast } from "sonner";
import { getFormattedDate } from "@/lib/utils";
import MessageCard from "./MessageCard";
import {
  CONSOLE_MESSAGES,
  TOAST_DESCRIPTIONS,
  TOAST_MESSAGES,
} from "@/constants/messages";
import { STATUS_COLORS, STATUS_VARIANTS } from "@/constants/status";

const WEBHOOK_URL = "ws://localhost:3000";

const WebhookViewer = () => {
  const { connectionStatus, messages, disconnect, connect, clearMessages } =
    useWebSocket({
      url: WEBHOOK_URL,
      autoConnect: false,
      onMessage: (data) => {
        toast(TOAST_MESSAGES.NEW_MESSAGE, {
          description: getFormattedDate(new Date()),
        });
        console.log(CONSOLE_MESSAGES.NEW_MESSAGE, data);
      },
      onOpen: () => {
        toast(TOAST_MESSAGES.CONNECTED, {
          description: TOAST_DESCRIPTIONS.CONNECTED,
        });
        console.log(CONSOLE_MESSAGES.CONNECTED);
      },
      onClose: () => {
        toast(TOAST_MESSAGES.DISCONNECTED, {
          description: TOAST_DESCRIPTIONS.DISCONNECTED,
        });
        console.log(CONSOLE_MESSAGES.DISCONNECTED);
      },
      onError: (error) => {
        toast(TOAST_MESSAGES.ERROR, {
          description: TOAST_DESCRIPTIONS.ERROR,
        });
        console.error(CONSOLE_MESSAGES.WEBSOCKET_ERROR, error);
      },
    });

  const handleClearMessages = () => {
    clearMessages();
    toast(TOAST_MESSAGES.MESSAGES_CLEARED, {
      description: TOAST_DESCRIPTIONS.MESSAGES_CLEARED,
    });
  };

  const getStatusVariant = () => {
    switch (connectionStatus) {
      case "connected":
        return STATUS_VARIANTS.CONNECTED;
      case "connecting":
        return STATUS_VARIANTS.CONNECTING;
      case "error":
        return STATUS_VARIANTS.ERROR;
      default:
        return STATUS_VARIANTS.DISCONNECTED;
    }
  };

  const getStatusColor = () => {
    switch (connectionStatus) {
      case "connected":
        return STATUS_COLORS.CONNECTED;
      case "connecting":
        return STATUS_COLORS.CONNECTING;
      case "error":
        return STATUS_COLORS.ERROR;
      default:
        return STATUS_COLORS.DISCONNECTED;
    }
  };

  return (
    <div className="p-3 mx-auto w-full">
      <div className="bg-white rounded-lg shadow-lg p-4">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-3 w-full justify-end">
            <Badge className={`flex items-center gap-2 ${getStatusVariant()}`}>
              <div className={`w-2 h-2 rounded-full ${getStatusColor()}`}></div>
              <span className="text-sm font-medium capitalize">
                {connectionStatus}
              </span>
            </Badge>

            <ConnectButton
              connectionStatus={connectionStatus}
              disconnect={disconnect}
              connect={connect}
            />
            <Button
              onClick={handleClearMessages}
              className="bg-gray-500 text-white rounded-md hover:bg-gray-600 text-sm"
            >
              Clear
            </Button>
          </div>
        </div>

        <div className="mb-4 text-right">
          <p className="text-sm text-gray-600">
            Connected to:{" "}
            <code className="bg-gray-100 px-2 py-1 rounded shadow-md">
              {WEBHOOK_URL}
            </code>
          </p>
        </div>

        {/* Message History */}
        <div>
          <Badge className="font-semibold mb-3 text-md">
            {messages.length} message{messages.length !== 1 ? "s" : ""}
          </Badge>
          <div className="max-h-112 overflow-y-auto flex gap-2 flex-wrap-reverse flex-row-reverse">
            {messages.length === 0 ? (
              <p className="text-gray-500 text-center py-8 w-full">
                No messages received yet
              </p>
            ) : (
              messages.map((message, index) => (
                <MessageCard
                  key={index}
                  message={message}
                  sequenceNumber={index + 1}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WebhookViewer;
