import { Axios } from "axios";

async function initHttp(token: string | null) {
  const host = import.meta.env.VITE_UNI_CLASS_BACKEND_HOST;
  const client = new Axios({
    baseURL: host,
    responseType: "json",
    headers: {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : undefined,
    },
  });

  // Add a response interceptor
  client.interceptors.response.use(
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

  return client;
}

export default initHttp;
