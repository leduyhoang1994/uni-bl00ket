import { useToast } from "@/cms/hooks/use-toast.hook";
import useAuthStore from "@/stores/cms-store/auth.store";
import { Axios } from "axios";

let internalHttp: Axios | null = null;
let cmsHttp: Axios | null = null;

export enum CmsApiRoutes {
  Login = "cms/auth/login",
  ListGame = "/cms/game/list",
  CreateGame = "/cms/game",
  GetGame = "/cms/game",
  UpdateGame = "/cms/game/update",
  SearchGame = "/cms/game/search",
}

export async function initInternalHttp(token: string | null, force?: boolean) {
  if (internalHttp && !force) {
    return internalHttp;
  }

  const host = import.meta.env.VITE_UNI_CLASS_BACKEND_HOST;
  internalHttp = new Axios({
    baseURL: host,
    responseType: "json",
    headers: {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : undefined,
    },
  });

  // Add a response interceptor
  internalHttp.interceptors.response.use(
    function (response) {
      if (response.status !== 200) {
        return Promise.reject(response);
      }

      return JSON.parse(response.data);
    },
    function (error) {
      return Promise.reject(error);
    }
  );

  return internalHttp;
}

export async function initCmsHttp(token?: string) {
  if (cmsHttp) {
    return cmsHttp;
  }

  const host = import.meta.env.VITE_UNI_CLASS_BACKEND_HOST;
  cmsHttp = new Axios({
    baseURL: host,
    responseType: "json",
    headers: {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : undefined,
    },
  });

  cmsHttp.interceptors.request.use((config) => {
    if (!token) {
      token = useAuthStore.getState().token || undefined;
    }
    config.headers["Authorization"] = `Bearer ${token}`;
    return config;
  });

  // Add a response interceptor
  cmsHttp.interceptors.response.use(
    function (response) {
      if (response.status !== 200) {
        const resData = JSON.parse(response.data);

        return Promise.reject(resData);
      }

      return JSON.parse(response.data);
    },
    function (error) {
      return Promise.reject(error);
    }
  );

  return cmsHttp;
}
