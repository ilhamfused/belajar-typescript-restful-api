import express from "express";
import { publicRouter } from "../route/public-api";

export const app = express();
app.use(express.json());
app.use(publicRouter);
