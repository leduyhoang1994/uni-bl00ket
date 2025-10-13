import {
  CSidebar,
  CSidebarBrand,
  CSidebarHeader,
  CSidebarNav,
  CNavItem,
  CNavLink,
} from "@coreui/react";

import CIcon from "@coreui/icons-react";
import { cilCaretLeft, cilCaretRight, cilPuzzle } from "@coreui/icons";
import { useCallback, useState } from "react";
import { NavLink } from "react-router";

export default function AdminSidebar() {
  const [isShow, setIsShow] = useState<boolean>(false);
  const isActive = useCallback(({ isActive }: any) => {
    let className = "nav-link";
    if (isActive) {
      className += " active";
    }
    return className;
  }, []);

  return (
    <CSidebar className={`border-end ${isShow ? "show" : ""}`}>
      <div className="sidebar__toggle" onClick={() => setIsShow(!isShow)}>
        <CIcon
          width={10}
          height={10}
          color="red"
          icon={isShow ? cilCaretLeft : cilCaretRight}
        />
      </div>
      <CSidebarHeader className="border-bottom">
        <NavLink to="/cms">CMS</NavLink>
      </CSidebarHeader>
      <CSidebarNav>
        <CNavItem>
          <NavLink to="/cms/admin/game" className={isActive}>
            <CIcon customClassName="nav-icon" icon={cilPuzzle} /> Games
          </NavLink>
        </CNavItem>
      </CSidebarNav>
    </CSidebar>
  );
}
