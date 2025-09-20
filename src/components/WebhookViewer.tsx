import { useWebSocket } from "../hooks/useWebSocket";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import ConnectButton from "./ConnectButton";
import { toast } from "sonner";
import { getFormattedDate } from "@/lib/utils";
import MessageCard from "./MessageCard";

const WEBHOOK_URL = "ws://localhost:3000";

const WebhookViewer = () => {
  const { connectionStatus, messages, disconnect, connect, clearMessages } =
    useWebSocket({
      url: WEBHOOK_URL,
      autoConnect: false,
      onMessage: (data) => {
        toast("New webhook message received", {
          description: getFormattedDate(new Date()),
        });
        console.log("New webhook message received:", data);
      },
      onOpen: () => {
        toast("Connected to webhook server", {
          description: "You are now connected to the webhook server",
        });
        console.log("Connected to webhook server");
      },
      onClose: () => {
        toast("Disconnected from webhook server", {
          description: "You are now disconnected from the webhook server",
        });
        console.log("Disconnected from webhook server");
      },
      onError: (error) => {
        toast("Error connecting to webhook server", {
          description: "Please check your internet connection and try again",
        });
        console.error("WebSocket error:", error);
      },
    });

  const handleClearMessages = () => {
    clearMessages();
    toast("Messages cleared", {
      description: "All messages have been cleared",
    });
  };

  const getStatusVariant = () => {
    switch (connectionStatus) {
      case "connected":
        return "success";
      case "connecting":
        return "warning";
      case "error":
        return "destructive";
      default:
        return "secondary";
    }
  };

  const getStatusColor = () => {
    switch (connectionStatus) {
      case "connected":
        return "bg-green-500";
      case "connecting":
        return "bg-yellow-500";
      case "error":
        return "bg-red-500";
      default:
        return "bg-gray-500";
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
