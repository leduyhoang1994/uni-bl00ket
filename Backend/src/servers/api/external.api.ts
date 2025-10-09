import { ExternalHttpRoute } from "@Common/constants/http.constant";
import { Express } from "express";
import HostRepository from "../../host/host.repo";

export default function initExternalApi(app: Express) {
  app.post(ExternalHttpRoute.CreateHosts, async (req, res) => {
    const hostRepository = await HostRepository.create({
      gameMode: req.body.gameMode,
    });

    
  });
}
