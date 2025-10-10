import express, {
  NextFunction,
  Response as ExResponse,
  Request as ExRequest,
} from "express";
import helmet from "helmet";
import cors from "cors";
import { RegisterRoutes } from "../routes";
import swaggerUi from "swagger-ui-express";
import { ValidateError } from "tsoa";
import { AuthError } from "../base/errors/auth.error";
import path from "path";
import fs from "fs";

const app = express();
export const JWT_SECRET = "secretKey";

app.use(helmet());
// Configure CORS
const corsOptions = {
  origin: "*",
  allowedHeaders: ["Content-Type", "Authorization", "x-api-key"],
};
app.use(cors(corsOptions)); // Use the cors middleware
app.use(express.json());

app.get("/", (req, res) => {
  res.send("MIIS");
});

app.use(
  "/docs",
  swaggerUi.serve,
  async (_req: express.Request, res: express.Response) => {
    const swaggerPath = path.join(__dirname, "../swagger.json");
    const swaggerDocument = JSON.parse(fs.readFileSync(swaggerPath, "utf-8"));
    
    return res.send(swaggerUi.generateHTML(swaggerDocument));
  }
);

RegisterRoutes(app);

app.use(function notFoundHandler(_req, res: ExResponse) {
  res.status(404).send({
    message: "Not Found",
  });
});

app.use(function errorHandler(
  err: unknown,
  req: ExRequest,
  res: ExResponse,
  next: NextFunction
): ExResponse | void {
  if (err instanceof ValidateError) {
    console.warn(`Caught Validation Error for ${req.path}:`, err.fields);
    return res.status(422).json({
      message: "Validation Failed",
      details: err?.fields,
    });
  }

  if (err instanceof AuthError) {
    return res.status(401).json({
      message: err.message,
    });
  }

  if (err instanceof Error) {
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }

  next();
});

export default app;
