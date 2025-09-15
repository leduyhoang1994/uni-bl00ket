import { Axios } from "axios";

async function initHttp(token: string) {
  const client = new Axios({
    baseURL: "http://localhost:3000",
    responseType: "json",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
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
