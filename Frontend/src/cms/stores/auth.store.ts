import { CmsApiRoutes, initCmsHttp } from "@/game/common/utils/http.util";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export type User = {
  id: string;
  name: string;
  email: string;
};

export type AuthStoreType = {
  token: string | null;
  loading: boolean;
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
};

const useAuthStore = create<AuthStoreType>()(
  persist(
    (set) => {
      return {
        token: null,
        loading: false,
        user: null,
        login: async (username: string, password: string) => {
          await set({ loading: true });
          try {
            const client = await initCmsHttp();
            const loginData = JSON.stringify({
              username,
              password,
            });

            const loginResponse = await client.post(
              CmsApiRoutes.Login,
              loginData
            );

            const { user, token } = loginResponse.data;
            await set({ user, token, loading: false });
          } catch (err) {
            console.error(err);
            await set({ loading: false });
            throw err;
          }
        },
        logout: () => {
          set({ token: null, user: null });
        },
      };
    },
    { name: "auth-store" }
  )
);

export default useAuthStore;
