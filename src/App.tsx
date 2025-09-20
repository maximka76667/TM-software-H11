import "./App.css";
import { Toaster } from "./components/ui/sonner";
import WebhookViewer from "./components/WebhookViewer";

const toastConfig = {
  position: "bottom-center" as const,
  duration: 3000,
  richColors: true,
  closeButton: true,
};

function App() {
  return (
    <>
      <div className="flex flex-col items-center justify-center h-screen w-screen">
        <h1 className="text-3xl font-bold text-black my-2">
          Training Month - Hyperloop H11
        </h1>
        <WebhookViewer />
      </div>

      <Toaster {...toastConfig} />
    </>
  );
}

export default App;
