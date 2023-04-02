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
  const { 
    hours, 
    minutes, 
    machine,
  } = req.body as { 
    hours: string;
    minutes: string;
    machine: string;
  };
  const timer = new Timer({ minutes, hours, machine });
  await timer.save();
  res.status(201).json({ timer });
  next();
})