import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CPagination,
  CPaginationItem,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from "@coreui/react";
import { useToast } from "../hooks/use-toast.hook";
import { useCallback, useLayoutEffect } from "react";
import GameStore from "@/stores/cms-store/game.store";
import { useNavigate } from "react-router";
import "../styles/game.list.scss";
import CIcon from "@coreui/icons-react";
import { cilCopy, cilPlus } from "@coreui/icons";
import GameFilter from "./filter";
import UniPagination from "../components/pagination";

export default function GameList() {
  const { showSuccess } = useToast();
  const { list: games, loadGames, page, total_page, limit } = GameStore();
  const navigate = useNavigate();

  useLayoutEffect(() => {
    loadGames();
  }, []);

  const handleCopyClick = useCallback(async (textToCopy: string, e?: any) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    try {
      await navigator.clipboard.writeText(textToCopy);
      showSuccess(`Đã copy Game ID: ${textToCopy}`);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  }, []);

  const navigateEdit = useCallback((id: string) => {
    navigate(`/cms/admin/game/edit/${id}`);
  }, []);

  const navigateCreate = useCallback(() => {
    navigate("/cms/admin/game/create");
  }, []);

  const handlePaginate = useCallback(async (page: number) => {
    await loadGames(null, page, limit);
  }, []);

  return (
    <div>
      <div className="my-2 text-end">
        <CButton color="primary" onClick={navigateCreate}>
          <CIcon icon={cilPlus} className="me-2" />
          Tạo mới
        </CButton>
      </div>
      <CCard className="my-2">
        <CCardHeader>Bộ lọc</CCardHeader>
        <CCardBody>
          <GameFilter />
        </CCardBody>
      </CCard>
      <CCard>
        <CCardHeader as={"h5"}>Danh sách Games</CCardHeader>
        <CCardBody>
          <CTable hover responsive className="game-list">
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell scope="col">ID</CTableHeaderCell>
                <CTableHeaderCell scope="col">Tên Game</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {games.map((game) => (
                <CTableRow
                  className="cursor-pointer"
                  onClick={() => navigateEdit(game._id)}
                  key={game._id}
                >
                  <CTableHeaderCell scope="row" className="game-list__id-cell">
                    <CButton
                      className="p-0"
                      color="link"
                      onClick={(e) => {
                        handleCopyClick(game._id, e);
                      }}
                    >
                      {game._id} <CIcon icon={cilCopy} />
                    </CButton>
                  </CTableHeaderCell>
                  <CTableDataCell>{game.name}</CTableDataCell>
                </CTableRow>
              ))}
            </CTableBody>
          </CTable>
          <UniPagination
            page={page}
            total_page={total_page}
            onChange={handlePaginate}
          />
        </CCardBody>
      </CCard>
    </div>
  );
}
