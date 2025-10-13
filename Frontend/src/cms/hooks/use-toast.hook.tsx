import { useToastContext } from "../components/toast-provider";

export function useToast() {
  const { showToast } = useToastContext();

  return {
    showSuccess: (msg: string, title?: string) =>
      showToast("success", msg, title),
    showError: (msg: string, title?: string) => showToast("error", msg, title),
    showInfo: (msg: string, title?: string) => showToast("info", msg, title),
    showWarning: (msg: string, title?: string) =>
      showToast("warning", msg, title),
  };
}
