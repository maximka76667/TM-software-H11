import { useWebSocket } from "./useWebSocket";
import { useCallback } from "react";
import { ToastNotifications } from "@/lib/notifications";
import { CONSOLE_MESSAGES } from "@/constants/messages";
import { WEBHOOK_URL } from "@/constants/ws";
import type MetricMessage from "@/types/MetricMessage";

export const useWebhookConnection = () => {
  const handleMessage = useCallback((data: MetricMessage) => {
    ToastNotifications.showNewMessage();
    console.log(CONSOLE_MESSAGES.NEW_MESSAGE, data);
  }, []);

  const handleOpen = useCallback(() => {
    ToastNotifications.showConnected();
    console.log(CONSOLE_MESSAGES.CONNECTED);
  }, []);

  const handleClose = useCallback(() => {
    ToastNotifications.showDisconnected();
    console.log(CONSOLE_MESSAGES.DISCONNECTED);
  }, []);

  const handleError = useCallback((error: Event) => {
    ToastNotifications.showError();
    console.error(CONSOLE_MESSAGES.WEBSOCKET_ERROR, error);
  }, []);

  const webSocketCallbacks = {
    onMessage: handleMessage,
    onOpen: handleOpen,
    onClose: handleClose,
    onError: handleError,
  };

  return useWebSocket({
    url: WEBHOOK_URL,
    autoConnect: true,
    ...webSocketCallbacks,
  });
};
