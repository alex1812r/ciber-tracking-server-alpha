import { Router } from 'express';
import { Timer } from './schemas/timer.schema';
import moment from 'moment';

export const timersRouter = Router();

timersRouter.get('/', async (req, res, next) => {
  const { date } = req.query as { date?: string };
  const timers = await Timer
    .find()
    .where({ 
      deletedAt: null,
      createdAt: {
        $gte: moment(moment(date).format('DD/MM/YYYY 00:00:01')).toDate(), 
        $lt: moment(moment(date).format('DD/MM/YYYY 23:59:59')).toDate()
      }
    })
    .sort({ createdAt: 'desc' });
  const count = await Timer.count()
    .where({
      deletedAt: null,
      createdAt: {
        $gte: moment(moment(date).format('DD/MM/YYYY 00:00:01')).toDate(), 
        $lt: moment(moment(date).format('DD/MM/YYYY 23:59:59')).toDate()
      }
    });
  res.status(200).json({ timersList: { items: timers, count } });
  next();
});

timersRouter.post('/', async (req, res, next) => {
  const { 
    hours, 
    minutes, 
    machine,
    paymentMethod,
    addControl,
    comment
  } = req.body as { 
    hours: string;
    minutes: string;
    machine: string;
    paymentMethod: string;
    addControl: boolean;
    comment: string
  };
  const timer = new Timer({ 
    minutes, 
    hours, 
    machine, 
    paymentMethod,
    addControl,
    comment
  });
  await timer.save();
  res.status(201).json({ timer });
  next();
})

timersRouter.delete('/:id', async (req, res, next) => {
  const { id } = req.params;
  await Timer.updateOne({ _id: id }, { deletedAt: new Date() })
  res.status(200).json({})
  next();
});