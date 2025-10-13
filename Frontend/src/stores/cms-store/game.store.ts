import { CmsApiRoutes, initCmsHttp } from "@/utils/http.util";
import { Game, Question } from "@common/types/game.type";
import { create } from "zustand";

export type GameStoreType = {
  list: Array<Game>;
  limit: number;
  page: number;
  total: number;
  total_page: number;
  currentGame: Game | null;
  currentGameQuestions: Array<Question>;
  searchText: string;
  setList: (list: Array<Game>) => void;
  setCurrentGame: (game: Game | null) => void;
  loadGames: (
    search?: string | null,
    page?: number,
    limit?: number
  ) => Promise<void>;
  loadGameById: (id: string) => void;
  setCurrentGameQuestions: (questions: Array<Question>) => void;
};

const initGameStoreData = {
  list: [],
  currentGame: null,
  searchText: "",
  limit: 10,
  page: 1,
  total: 0,
  total_page: 0,
  currentGameQuestions: [],
};

const GameStore = create<GameStoreType>((set, get) => ({
  ...initGameStoreData,
  setList: (list) => set({ list }),
  setCurrentGame: (game) => set({ currentGame: game }),
  loadGames: async (
    search: string | null = "",
    page: number = 1,
    limit: number = 10
  ) => {
    const client = await initCmsHttp();
    const lastSearch = get().searchText;
    const finalSearch = search === null ? lastSearch : search;

    const games = await client.post(
      "/cms/game/list",
      JSON.stringify({
        search: finalSearch,
        page,
        limit,
      })
    );

    set({
      list: games.data.list,
      searchText: finalSearch,
      page: games.data.page,
      limit: games.data.limit,
      total: games.data.total,
      total_page: games.data.total_page,
    });
  },
  loadGameById: async (id) => {
    const client = await initCmsHttp();
    const getResponse = (await client.get(
      `${CmsApiRoutes.GetGame}/${id}`
    )) as any;

    if (!getResponse.success) {
      return;
    }

    const gameData = getResponse.data?.game;

    if (!gameData) {
      return;
    }

    set({
      currentGame: gameData,
      currentGameQuestions: getResponse.data.game_questions,
    });
  },
  setCurrentGameQuestions: (questions) =>
    set({ currentGameQuestions: questions }),
}));

export default GameStore;
