import { useState, useCallback } from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardDescription, CardHeader } from "../ui/card";
import { sendCommand } from "@/lib/api";
import { ToastNotifications } from "@/lib/notifications";
import { API_URL } from "@/constants/urls";
import type { Action } from "@/types/Action";
import { ACTIONS } from "@/constants/actions";
import { Spinner } from "../ui/spinner";

const WebhookSender = () => {
  const [pendingActions, setPendingActions] = useState<Set<Action>>(new Set());

  // Memoized helper to add action to pending set
  const addPending = useCallback((action: Action) => {
    setPendingActions((prev) => new Set(prev).add(action));
  }, []);

  // Memoized helper to remove action from pending set
  const removePending = useCallback((action: Action) => {
    setPendingActions((prev) => {
      const next = new Set(prev);
      next.delete(action);
      return next;
    });
  }, []);

  const handleSendCommand = useCallback(
    async (action: Action) => {
      // Skip if already pending
      if (pendingActions.has(action)) return;

      addPending(action);

      try {
        const req = sendCommand(action);
        ToastNotifications.showCommandResult(req, action);

        const res = await req;
        console.log("Command sent successfully", res);
      } catch (error: unknown) {
        console.error(error instanceof Error ? error.message : error);
      } finally {
        removePending(action);
      }
    },
    [pendingActions, addPending, removePending]
  );

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
                aria-label={`Send ${action} command`}
                aria-busy={isLoading}
                className={`w-full transition-all ${classname ?? ""}`}
              >
                {isLoading && <Spinner />}
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
