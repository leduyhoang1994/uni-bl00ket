import { CmsApiRoutes, initCmsHttp } from "@/game/common/utils/http.util";
import { CButton, CCard, CCardBody, CCardHeader } from "@coreui/react";
import { FormEvent, useCallback, useLayoutEffect, useState } from "react";
import GameForm from "./form";
import { useParams } from "react-router";
import GameStore from "@/cms/stores/game.store";
import { useToast } from "../hooks/use-toast.hook";
import CIcon from "@coreui/icons-react";
import { cilCopy } from "@coreui/icons";
import GameQuestions from "./questions";

export default function GameEdit() {
  const { game_id } = useParams();
  const { loadGameById, currentGame, currentGameQuestions, setCurrentGameQuestions } = GameStore();
  const { showError, showSuccess } = useToast();

  const handleSubmit = useCallback(async (e: FormEvent) => {
    e.preventDefault();
    const client = await initCmsHttp();

    const formData = new FormData(e.target as HTMLFormElement);

    const createData = (await client.post(
      CmsApiRoutes.UpdateGame,
      formData
    )) as any;

    if (!createData.success) {
      showError(createData.message);
      return;
    }

    setCurrentGameQuestions(createData.data.game_questions);

    showSuccess("Cập nhật game thành công");
  }, []);

  useLayoutEffect(() => {
    if (!game_id) return;
    loadGameById(game_id);
  }, [game_id]);

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

  return (
    <>
      <CCard>
        <CCardHeader>Tạo mới Game</CCardHeader>
        <CCardBody>
          <div className="my-2 d-flex align-items-center gap-2">
            ID:
            <CButton
              className="p-0"
              color="link"
              onClick={(e) => {
                handleCopyClick(currentGame?._id || "", e);
              }}
            >
              {currentGame?._id} <CIcon icon={cilCopy} />
            </CButton>
          </div>
          <GameForm
            key={currentGame?._id}
            submitBtnText="Cập nhật"
            gameData={currentGame ?? undefined}
            onSubmit={handleSubmit}
          />
        </CCardBody>
      </CCard>
      <CCard className="my-4">
        <CCardHeader>Danh sách câu hỏi</CCardHeader>
        <CCardBody>
          <GameQuestions questions={currentGameQuestions} />
        </CCardBody>
      </CCard>
    </>
  );
}
