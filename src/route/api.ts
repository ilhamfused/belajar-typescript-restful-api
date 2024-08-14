import express from "express";
import { authMiddleware } from "../middleware/auth-middleware";

export const apiRouter = express.Router();
apiRouter.use(authMiddleware);
