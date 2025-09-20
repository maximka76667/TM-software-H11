import type MetricMessage from "@/types/MetricMessage";
import { useState, useEffect, useRef, useCallback } from "react";

export type ConnectionStatus =
  | "connecting"
  | "connected"
  | "disconnected"
  | "error";

export interface UseWebSocketOptions {
  url: string;
  autoConnect?: boolean;
  onMessage?: (data: MetricMessage) => void;
  onOpen?: () => void;
  onClose?: () => void;
  onError?: (error: Event) => void;
}

export interface UseWebSocketReturn {
  connectionStatus: ConnectionStatus;
  messages: MetricMessage[];
  connect: () => void;
  disconnect: () => void;
  reconnect: () => void;
  clearMessages: () => void;
  sendMessage: (message: string) => void;
}

export const useWebSocket = (
  options: UseWebSocketOptions
): UseWebSocketReturn => {
  const {
    url,
    autoConnect = true,
    onMessage,
    onOpen,
    onClose,
    onError,
  } = options;

  const [connectionStatus, setConnectionStatus] =
    useState<ConnectionStatus>("disconnected");
  const [messages, setMessages] = useState<MetricMessage[]>([]);

  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const connect = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      return; // Already connected
    }

    try {
      setConnectionStatus("connecting");
      const ws = new WebSocket(url);
      wsRef.current = ws;

      ws.onopen = () => {
        console.log("WebSocket connected to:", url);
        setConnectionStatus("connected");
        onOpen?.();
      };

      ws.onmessage = (event) => {
        try {
          const receivedData: MetricMessage = JSON.parse(event.data);

          setMessages((prev) => [...prev, receivedData]);
          onMessage?.(receivedData);
        } catch (error) {
          console.error("Error parsing WebSocket message:", error);
          // Handle non-JSON messages
          setMessages((prev) => [...prev, event.data]);
          onMessage?.(event.data);
        }
      };

      ws.onclose = (event) => {
        console.log("WebSocket disconnected:", event.code, event.reason);
        setConnectionStatus("disconnected");
        onClose?.();
      };

      ws.onerror = (error) => {
        console.error("WebSocket error:", error);
        setConnectionStatus("error");
        onError?.(error);
      };
    } catch (error) {
      console.error("Failed to create WebSocket connection:", error);
      setConnectionStatus("error");
    }
  }, [url, onMessage, onOpen, onClose, onError]);

  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }

    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    setConnectionStatus("disconnected");
  }, []);

  const reconnect = useCallback(() => {
    disconnect();
    // Small delay before reconnecting
    reconnectTimeoutRef.current = setTimeout(() => {
      connect();
    }, 1000);
  }, [disconnect, connect]);

  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  const sendMessage = useCallback((message: string) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(message);
    } else {
      console.warn("WebSocket is not connected. Cannot send message.");
    }
  }, []);

  // Auto-connect on mount
  useEffect(() => {
    if (autoConnect) {
      connect();
    }
  }, [autoConnect, connect]);

  return {
    connectionStatus,
    messages,
    connect,
    disconnect,
    reconnect,
    clearMessages,
    sendMessage,
  };
};
