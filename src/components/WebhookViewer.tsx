import { useWebSocket } from "../hooks/useWebSocket";

import { Badge } from "./ui/badge";
import { Button } from "./ui/button";

import ConnectButton from "./ConnectButton";
import MessageCard from "./MessageCard";

import { ToastNotifications } from "@/lib/notifications";
import { getStatusVariant, getStatusColor } from "@/lib/statusUtils";

import { CONSOLE_MESSAGES } from "@/constants/messages";
import { WEBHOOK_URL } from "@/constants/ws";

const WebhookViewer = () => {
  const { connectionStatus, messages, disconnect, connect, clearMessages } =
    useWebSocket({
      url: WEBHOOK_URL,
      autoConnect: false,
      onMessage: (data) => {
        ToastNotifications.showNewMessage();
        console.log(CONSOLE_MESSAGES.NEW_MESSAGE, data);
      },
      onOpen: () => {
        ToastNotifications.showConnected();
        console.log(CONSOLE_MESSAGES.CONNECTED);
      },
      onClose: () => {
        ToastNotifications.showDisconnected();
        console.log(CONSOLE_MESSAGES.DISCONNECTED);
      },
      onError: (error) => {
        ToastNotifications.showError();
        console.error(CONSOLE_MESSAGES.WEBSOCKET_ERROR, error);
      },
    });

  const handleClearMessages = () => {
    clearMessages();
    ToastNotifications.showMessagesCleared();
  };

  const handleDisconnect = () => {
    disconnect();
    ToastNotifications.showDisconnecting();
  };

  const handleConnect = () => {
    connect();
    ToastNotifications.showConnecting();
  };

  return (
    <div className="p-3 mx-auto w-full">
      <div className="bg-white rounded-lg shadow-lg p-4">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-3 w-full justify-end">
            <Badge
              className={`flex items-center gap-2 ${getStatusVariant(
                connectionStatus
              )}`}
            >
              <div
                className={`w-2 h-2 rounded-full ${getStatusColor(
                  connectionStatus
                )}`}
              ></div>
              <span className="text-sm font-medium capitalize">
                {connectionStatus}
              </span>
            </Badge>

            <ConnectButton
              connectionStatus={connectionStatus}
              disconnect={handleDisconnect}
              connect={handleConnect}
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
