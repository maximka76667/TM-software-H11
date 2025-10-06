import React, { useCallback, useState } from "react";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { sendCommand } from "@/lib/api";
import { ToastNotifications } from "@/lib/notifications";

const ACTIONS = [
  { label: "Action 1", action: "action1", variant: "default" as const },
  { label: "Action 2", action: "action2", variant: "outline" as const },
  { label: "Error", action: "error", variant: "destructive" as const },
];

type Action = "action1" | "action2" | "error";

const WebhookSender = () => {
  const [loadingActions, setLoadingActions] = useState<string[]>([]);

  async function handleSendCommand(action: Action) {
    if (loadingActions.includes(action)) return;

    setLoadingActions((loadingActions) => [action, ...loadingActions]);

    try {
      const req = sendCommand(action);
      ToastNotifications.showCommandResult(req, action);

      const result = await req;
      console.log("Command sent successfully", result);
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(error.message);
      } else {
        console.error(error);
      }
    } finally {
      setLoadingActions((loadingActions) =>
        loadingActions.filter((a) => a !== action)
      );
    }
  }

  return (
    <Card className="max-w-xl w-full">
      <CardHeader>
        <CardTitle>Webhook Sender</CardTitle>
        <CardDescription>
          Send predefined actions to your backend.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {ACTIONS.map(({ label, action, variant }) => {
            const isLoading = loadingActions.includes(action);
            return (
              <Button
                key={action}
                variant={variant}
                onClick={() => handleSendCommand(action as Action)}
                disabled={isLoading}
                aria-label={`Send ${action}`}
                className="w-full"
              >
                {isLoading ? "Sending..." : label}
              </Button>
            );
          })}
        </div>
      </CardContent>

      <CardFooter className="flex-col items-start gap-2">
        <div className="text-sm text-muted-foreground">
          Endpoint:{" "}
          <code className="px-1.5 py-0.5 rounded bg-muted">/api/commands</code>
        </div>

        {/* {lastResult && (
          <div
            className={`text-sm ${
              lastResult.ok ? "text-green-600" : "text-red-600"
            }`}
          >
            {lastResult.ok ? "Success" : "Error"} for "{lastResult.action}"
            {lastResult.message ? ` — ${lastResult.message}` : null}
          </div>
        )} */}
        <p>test</p>
      </CardFooter>
    </Card>
  );
};

export default WebhookSender;
