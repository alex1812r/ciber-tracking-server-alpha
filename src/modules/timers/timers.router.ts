import { Router } from 'express';
import { Timer } from './schemas/timer.schema';

export const timersRouter = Router();

timersRouter.get('/', async (_req, res, next) => {
  const timers = await Timer.find();
  const count = await Timer.count();
  res.status(200).json({ items: timers, count });
  next();
});

timersRouter.post('/', async (req, res, next) => {
  const { startAt, endAt } = req.body as { startAt: string, endAt: string };
  const timer = new Timer({ startAt, endAt });
  await timer.save();
  res.status(201).json({ timer });
  next();
})