import { Router } from "express";
import { timersRouter } from "./modules/timers/timers.router";

export const apiRouter = Router();

apiRouter.get('/', (_req, res) => res.send('Hello World!'));

apiRouter.use('/timers', timersRouter)