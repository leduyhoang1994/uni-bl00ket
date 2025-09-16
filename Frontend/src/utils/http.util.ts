import { Axios } from "axios";

async function initHttp(token: string | null) {
  const client = new Axios({
    baseURL: "http://localhost:3000",
    responseType: "json",
    headers: {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : undefined,
    },
  });

  // Add a response interceptor
  client.interceptors.response.use(
    function (response) {
      return JSON.parse(response.data);
    },
    function (error) {
      return Promise.reject(error);
    }
  );

  return client;
}

export default initHttp;
