import useAuthStore from "@/stores/cms-store/auth.store";
import {
  CHeader,
  CHeaderNav,
  CNavItem,
  CContainer,
  CHeaderBrand,
  CNavLink,
} from "@coreui/react";
import { useCallback } from "react";

export default function AdminHeader() {
  const { logout } = useAuthStore();

  const handleLogout = useCallback(async () => {
    logout();
  }, []);

  return (
    <CHeader>
      <CContainer fluid>
        <CHeaderBrand href="#"></CHeaderBrand>
        <CHeaderNav>
          <CNavItem>
            <CNavLink href="#" onClick={handleLogout}>
              Logout
            </CNavLink>
          </CNavItem>
        </CHeaderNav>
      </CContainer>
    </CHeader>
  );
}
