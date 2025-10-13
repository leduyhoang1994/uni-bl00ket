import { Outlet } from "react-router";
import { CContainer, CHeaderDivider } from "@coreui/react";
import AdminSidebar from "../components/sidebar";
import AdminHeader from "../components/header";
import { withAuthProtection } from "../components/auth.hoc";

function AdminLayout() {
  return (
    <div className="d-flex min-vh-100 bg-light">
      <AdminSidebar />
      <div className="flex-grow-1 d-flex flex-column">
        <AdminHeader />
        <CHeaderDivider />
        <CContainer fluid className="px-4 py-3 flex-grow-1">
          <Outlet />
        </CContainer>
      </div>
    </div>
  );
}

export default withAuthProtection(AdminLayout);
