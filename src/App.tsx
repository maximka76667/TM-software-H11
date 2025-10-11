import "./App.css";
import { Toaster } from "./components/ui/sonner";
import WebhookViewer from "./pages/WebhookViewer";
import { Link, Route, Routes } from "react-router-dom";
import WebhookSender from "./pages/WebhookSender";
import { useWebhookConnection } from "./hooks/useWebSocketConnection";
import ConnectButton from "./components/common/ConnectButton";
import { Badge } from "./components/ui/badge";
import { getStatusColor, getStatusVariant } from "./lib/statusUtils";
import { useEffect, useState } from "react";

const toastConfig = {
  position: "bottom-center" as const,
  duration: 3000,
  richColors: true,
  closeButton: true,
};

function App() {
  const { connectionStatus, lastMetrics, disconnect, connect, sendCommand } =
    useWebhookConnection();

  const [currentTime, setCurrentTime] = useState(new Date());

  // Update current time every second for live counter
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <div className="flex flex-col items-center justify-center min-h-screen">
        <header className="flex items-center justify-between gap-10 w-full p-5 px-10">
          <div className="flex flex-col items-center">
            <h1 className="text-3xl font-bold text-black my-2">
              Training Month - Hyperloop H11
            </h1>

            <nav className="flex gap-4">
              <Link to="/viewer">Webhook Viewer</Link>
              <Link to="/sender">Webhook Sender</Link>
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <Badge
              aria-labelledby={"connection-status"}
              className={`flex items-center gap-2 ${getStatusVariant(
                connectionStatus
              )}`}
            >
              <div
                aria-hidden="true"
                className={`w-2 h-2 rounded-full ${getStatusColor(
                  connectionStatus
                )}`}
              />
              <span
                id="connection-status"
                className="text-sm font-medium capitalize"
              >
                {connectionStatus}
              </span>
            </Badge>

            <ConnectButton
              className="bg-gradient-to-br from-primary/5 to-primary/10 text-primary hover:bg-primary/10"
              connectionStatus={connectionStatus}
              disconnect={disconnect}
              connect={connect}
            />
          </div>
        </header>

        <main className="w-full flex justify-center items-center flex-1">
          <Routes>
            <Route
              path="/viewer"
              element={
                <WebhookViewer
                  lastMetrics={lastMetrics}
                  currentTime={currentTime}
                />
              }
            />
            <Route
              path="/sender"
              element={<WebhookSender sendCommand={sendCommand} />}
            />
          </Routes>
        </main>
      </div>

      <Toaster
        {...toastConfig}
        toastOptions={{
          style: {
            textAlign: "left",
          },
        }}
      />
    </>
  );
}

export default App;
