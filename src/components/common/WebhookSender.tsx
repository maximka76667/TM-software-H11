import { useState } from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardDescription, CardHeader } from "../ui/card";
import { sendCommand } from "@/lib/api";
import { ToastNotifications } from "@/lib/notifications";
import { API_URL } from "@/constants/urls";
import type { Action } from "@/types/Action";
import { ACTIONS } from "@/constants/actions";

const WebhookSender = () => {
  const [pendingActions, setPendingActions] = useState<Set<Action>>(new Set());

  // helper utilities for handling pending actions set
  // adds action to to the pending set
  const addPending = (a: Action) =>
    setPendingActions((prev) => {
      const next = new Set(prev);
      next.add(a);
      return next;
    });

  // removes action from the pending set
  const removePending = (a: Action) =>
    setPendingActions((prev) => {
      const next = new Set(prev);
      next.delete(a);
      return next;
    });

  async function handleSendCommand(action: Action) {
    // Skip if already pending
    if (pendingActions.has(action)) return;

    addPending(action);

    try {
      const req = sendCommand(action);
      ToastNotifications.showCommandResult(req, action);

      const res = await req;
      console.log("Command sent successfully", res);
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(error.message);
      } else {
        console.error(error);
      }
    } finally {
      removePending(action);
    }
  }

  return (
    <Card className="max-w-xl w-full m-4">
      <CardHeader>
        <CardDescription>
          Send predefined actions to your backend.
        </CardDescription>
        <div className="text-sm text-muted-foreground">
          Endpoint:{" "}
          <code className="px-1.5 py-0.5 rounded bg-muted">
            {API_URL}/api/command
          </code>
        </div>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          {ACTIONS.map(({ label, action, variant, classname }) => {
            const isLoading = pendingActions.has(action);
            return (
              <Button
                key={action}
                variant={variant}
                onClick={() => handleSendCommand(action)}
                disabled={isLoading}
                aria-label={`Send ${action}`}
                className={`w-full ${classname ?? ""}`}
              >
                {isLoading ? "Sending..." : label}
              </Button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default WebhookSender;
