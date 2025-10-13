import { Request } from "express";
import { getPayloadFromAuth } from "./utils/token";
import { AuthenticatedUser } from "@Common/types/socket.type";
import { AuthError } from "./base/errors/auth.error";

export async function expressAuthentication(
  request: Request,
  securityName: string,
  scopes?: string[]
): Promise<AuthenticatedUser | boolean> {
  if (securityName === "apiKey") {
    const apikey = request.headers["x-api-key"];

    if (!apikey) {
      return Promise.reject(new AuthError("API Key missing"));
    }

    if (apikey === (process.env.API_KEY || "uniclass")) {
      return Promise.resolve(true);
    } else {
      return Promise.reject(new AuthError("API Key mismatch"));
    }
  }

  if (securityName === "bearerAuth") {
    const authHeader = request.headers.authorization;
    if (authHeader?.startsWith("Bearer ")) {
      const token = authHeader.split(" ")[1];
      const hostId = request.body.hostId;

      if (!token || !hostId) {
        return Promise.reject(new AuthError("Token or hostId missing"));
      }

      try {
        const userData = await getPayloadFromAuth({ token, hostId });
        // Dữ liệu trả về ở đây sẽ được gán vào request.user
        return Promise.resolve(userData as AuthenticatedUser);
      } catch (error) {
        return Promise.reject(error);
      }
    } else {
      return Promise.reject(new AuthError("No bearer token provided"));
    }
  }

  if (securityName === "cmsBearerAuth") {
    const authHeader = request.headers.authorization;
    if (authHeader?.startsWith("Bearer ")) {
      const token = authHeader.split(" ")[1];

      if (!token) {
        return Promise.reject(new AuthError("Token missing"));
      }

      try {
        const userData = await getPayloadFromAuth({ token });
        // Dữ liệu trả về ở đây sẽ được gán vào request.user
        return Promise.resolve(userData as AuthenticatedUser);
      } catch (error) {
        return Promise.reject(error);
      }
    } else {
      return Promise.reject(new AuthError("No bearer token provided"));
    }
  }

  return Promise.reject(new AuthError("No security definition found"));
}
