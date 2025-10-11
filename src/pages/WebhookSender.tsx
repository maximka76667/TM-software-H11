import { useCallback } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { ToastNotifications } from "@/lib/notifications";
import { API_URL } from "@/constants/urls";
import { COMMANDS } from "@/constants/commands";
import useDocumentTitle from "@/hooks/useDocumentTitle";
import type Command from "@/types/Command";
import CommandButton from "@/components/common/CommandButton";

interface WebhookSenderProps {
  sendCommand: (command: Command) => void;
}

const WebhookSender = ({ sendCommand }: WebhookSenderProps) => {
  useDocumentTitle("Webhook Sender - Hyperloop H11");

  const handleSendCommand = useCallback(
    async (command: Command) => {
      try {
        sendCommand(command);
        ToastNotifications.showCommandResult(command);
        console.log("Command sent successfully", command);
      } catch (error: unknown) {
        ToastNotifications.showTextError(
          error instanceof Error ? error.message : (error as any).toString()
        );
        console.error(error instanceof Error ? error.message : error);
      }
    },
    [sendCommand]
  );

  return (
    <Card
      role="region"
      aria-label="Command sender section"
      className="w-full m-4"
    >
      <CardHeader>
        <CardTitle className="text-sm uppercase tracking-wide mb-2">
          Command Sender
        </CardTitle>
        <CardDescription>
          Send predefined actions to your backend.
        </CardDescription>
        <div className="text-sm text-muted-foreground mt-1">
          Endpoint:{" "}
          <code className="px-1.5 py-0.5 rounded bg-muted">
            {API_URL}/api/command
          </code>
        </div>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          {COMMANDS.map(
            ({ action, label, params, fixedParams, variant, classname }) => (
              <CommandButton
                key={`${action}-${label}`}
                label={label}
                action={action}
                params={params}
                fixedParams={fixedParams}
                variant={variant}
                classname={classname}
                onSendCommand={handleSendCommand}
              />
            )
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default WebhookSender;
