import { createServer } from "http";
import app from "./servers/api.server";
import { createSocketServer } from "./servers/socket.server";

// Tạo HTTP server từ app Express
const httpServer = createServer(app);
createSocketServer(httpServer);

// Start cả API và Socket trên cùng 1 cổng
httpServer.listen(3000, () => {
  console.log("API + Socket server running . . .");
});
