import { CmsApiRoutes, initCmsHttp } from "@/utils/http.util";
import { CCard, CCardBody, CCardHeader } from "@coreui/react";
import { FormEvent, useCallback } from "react";
import GameForm from "./form";
import { useToast } from "../hooks/use-toast.hook";
import { useNavigate } from "react-router";

export default function GameCreate() {
  const { showError, showSuccess } = useToast();
  const navigate = useNavigate();

  const handleSubmit = useCallback(async (e: FormEvent) => {
    e.preventDefault();
    const client = await initCmsHttp();

    const formData = new FormData(e.target as HTMLFormElement);

    try {
      const createData = (await client.post(
        CmsApiRoutes.CreateGame,
        formData
      )) as any;

      if (!createData.success) {
        showError(createData.message);
        return;
      }

      showSuccess("Tạo game thành công");
      navigate(`/cms/admin/game/edit/${createData.data.game._id}`);
    } catch (error: any) {
      if (error.uni_error) {
        showError(error.message);
      }
    }
  }, []);

  return (
    <CCard>
      <CCardHeader>Tạo mới Game</CCardHeader>
      <CCardBody>
        <GameForm onSubmit={handleSubmit} />
      </CCardBody>
    </CCard>
  );
}
