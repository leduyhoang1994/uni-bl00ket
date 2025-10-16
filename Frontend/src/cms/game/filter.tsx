import GameStore from "@/cms/stores/game.store";
import { CForm, CFormInput } from "@coreui/react";
import { FormEvent, useCallback } from "react";

export default function GameFilter() {
  const { loadGames } = GameStore();
  const handleSubmit = useCallback(async (e: FormEvent) => {
    e.preventDefault();

    const formData = new FormData(e.target as HTMLFormElement);
    await loadGames(formData.get("game_name") as string);
  }, []);
  return (
    <CForm onSubmit={handleSubmit} className="d-flex gap-2">
      <div style={{ flex: 1 }}>
        <CFormInput
          type="text"
          id="game_name"
          name="game_name"
          floatingLabel="Tên game"
          placeholder="Nhập tên game"
        />
      </div>
      <button className="btn btn-primary">Tìm kiếm</button>
    </CForm>
  );
}
