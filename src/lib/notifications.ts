import { toast } from "sonner";
import { getFormattedDate } from "@/lib/utils";
import { TOAST_MESSAGES, TOAST_DESCRIPTIONS } from "@/constants/messages";

// Single internal method that all public methods use
function showToast(message: string, description?: string) {
  toast(message, {
    description,
  });
}

// Public methods that all use the same internal toast function
function showNewMessage() {
  showToast(TOAST_MESSAGES.NEW_MESSAGE, getFormattedDate(new Date()));
}

function showConnected() {
  showToast(TOAST_MESSAGES.CONNECTED, TOAST_DESCRIPTIONS.CONNECTED);
}

function showDisconnected() {
  showToast(TOAST_MESSAGES.DISCONNECTED, TOAST_DESCRIPTIONS.DISCONNECTED);
}

function showConnecting() {
  showToast(TOAST_MESSAGES.CONNECTING, TOAST_DESCRIPTIONS.CONNECTING);
}

function showDisconnecting() {
  showToast(TOAST_MESSAGES.DISCONNECTING, TOAST_DESCRIPTIONS.DISCONNECTING);
}

function showError() {
  showToast(TOAST_MESSAGES.ERROR, TOAST_DESCRIPTIONS.ERROR);
}

function showMessagesCleared() {
  showToast(
    TOAST_MESSAGES.MESSAGES_CLEARED,
    TOAST_DESCRIPTIONS.MESSAGES_CLEARED
  );
}

export const ToastNotifications = {
  showNewMessage,
  showConnected,
  showDisconnected,
  showConnecting,
  showDisconnecting,
  showError,
  showMessagesCleared,
};
