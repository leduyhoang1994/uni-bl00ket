import "@coreui/coreui/dist/css/coreui.min.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/styles.scss";
import { Outlet } from "react-router";
import { ToastProvider } from "../components/toast-provider";

export default function CmsLayout() {
  return (
    <ToastProvider>
      <div>
        <Outlet />
      </div>
    </ToastProvider>
  );
}
