import { createServer } from "http";
import app from "./servers/api.server";
import { createSocketServer } from "./servers/socket.server";

const port = parseInt(process.argv[2]) || 4000;

console.log(`Starting server on port ${port}...`);

// Tạo HTTP server từ app Express
const httpServer = createServer(app);
createSocketServer(httpServer);

// Start cả API và Socket trên cùng 1 cổng
httpServer.listen(port, () => {
  console.log(`API + Socket server running on ${port} . . .`);
});
