import "./App.css";
import { Toaster } from "./components/ui/sonner";
import WebhookViewer from "./components/WebhookViewer";

function App() {
  return (
    <>
      <div className="flex flex-col items-center justify-center h-screen w-screen">
        <h1 className="text-3xl font-bold text-black my-2">
          Training Month - Hyperloop H11
        </h1>
        <WebhookViewer />
      </div>

      <Toaster position="top-center" richColors />
    </>
  );
}

export default App;
