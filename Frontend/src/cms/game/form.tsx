import { GameMode } from "@common/constants/host.constant";
import { Game } from "@common/types/game.type";
import { CForm, CFormInput, CButton, CFormSelect } from "@coreui/react";
import { FormEvent, useCallback, useState } from "react";
import { useToast } from "../hooks/use-toast.hook";

export default function GameForm({
  onSubmit = async () => {},
  gameData,
  submitBtnText = "Tạo mới",
}: {
  onSubmit: (e: FormEvent) => Promise<void>;
  gameData?: Game;
  submitBtnText?: string;
}) {
  const [updating, setUpdating] = useState<boolean>(false);
  const { showWarning } = useToast();

  const handleSubmit = useCallback(
    async (e: FormEvent) => {
      setUpdating(true);
      e.preventDefault();

      const formData = new FormData(e.target as HTMLFormElement);
      
      if (!formData.get("game_mode") || formData.get("game_mode") === "0") {
        showWarning("Vui lòng chọn thể loại game");
        setUpdating(false);
        return;
      }

      onSubmit && (await onSubmit(e));
      setUpdating(false);
    },
    [onSubmit]
  );

  return (
    <CForm
      style={{ display: "flex", flexDirection: "column", gap: 10 }}
      onSubmit={handleSubmit}
    >
      <CFormInput
        type="hidden"
        id="game_id"
        name="game_id"
        defaultValue={gameData?._id}
      />
      <CFormInput
        type="text"
        id="game_name"
        name="game_name"
        floatingLabel="Tên game"
        placeholder="Nhập tên game"
        defaultValue={gameData?.name}
        required
      />
      <CFormSelect
        id="game_mode"
        name="game_mode"
        floatingLabel="Game Mode"
        defaultValue={gameData?.mode}
        required
      >
        <option value={0}>Chọn thể loại game</option>
        {Object.values(GameMode).map((mode) => (
          <option key={mode} value={mode}>
            {mode}
          </option>
        ))}
      </CFormSelect>
      <div>
        <CFormInput
          type="file"
          id="game_questions"
          name="game_questions"
          label="Upload câu hỏi"
          accept=".xlsx, .csv"
        />
      </div>
      <div className="text-end">
        <hr />
        <CButton type="submit" color="primary" disabled={updating}>
          {submitBtnText}
        </CButton>
      </div>
    </CForm>
  );
}
