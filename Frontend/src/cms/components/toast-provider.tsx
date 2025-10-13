import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useCallback,
} from "react";
import { CToaster, CToast, CToastHeader, CToastBody } from "@coreui/react";

type ToastType = "success" | "error" | "info" | "warning";

type ToastItem = {
  id: number;
  type: ToastType;
  title?: string;
  message: string;
};

type ToastContextType = {
  showToast: (type: ToastType, message: string, title?: string) => void;
};

const ToastContext = createContext<ToastContextType>({
  showToast: () => {},
});

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const showToast = useCallback(
    (type: ToastType, message: string, title?: string) => {
      const id = Date.now();
      setToasts((prev) => [...prev, { id, type, title, message }]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 3500);
    },
    []
  );

  const getColor = (type: ToastType) => {
    switch (type) {
      case "success":
        return "success";
      case "error":
        return "danger";
      case "warning":
        return "warning";
      default:
        return "info";
    }
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      {/* Toaster UI */}
      <CToaster placement="top-end" className="p-3">
        {toasts.map((toast) => (
          <CToast
            key={toast.id}
            autohide
            visible
            color={getColor(toast.type)}
            className="text-white mb-2 shadow-sm"
          >
            {toast.title && (
              <CToastHeader className="text-white">
                <strong className="me-auto">{toast.title}</strong>
              </CToastHeader>
            )}
            <CToastBody>{toast.message}</CToastBody>
          </CToast>
        ))}
      </CToaster>
    </ToastContext.Provider>
  );
}

export function useToastContext() {
  return useContext(ToastContext);
}
