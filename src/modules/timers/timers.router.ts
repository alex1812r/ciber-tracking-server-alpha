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
      startAt: {
        $gte: moment(date).startOf('day').toDate(), 
        $lt: moment(date).endOf('day').toDate()
      }
    })
    .sort({ createdAt: 'desc' });
  const count = await Timer.count()
    .where({
      deletedAt: null,
      startAt: {
        $gte: moment(date).startOf('day').toDate(), 
        $lt: moment(date).endOf('day').toDate()
      }
    });
  res.status(200).json({ timersList: { items: timers, count } });
  next();
});

timersRouter.get('/:id', async (req, res, next) => {
  const { id } = req.params as { id: string };
  const timer = await Timer.findOne().where({ _id: id })
  if (!timer) {
    res.status(404).send('timer not found');
    return;
  }
  res.status(200).json({ timer });
  next()
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

timersRouter.put('/:id', async (req, res, next) => {
  const { id } = req.params as { id: string };
  const timer = await Timer.findOne().where({ _id: id })
  if (!timer) {
    res.status(404).send('timer not found');
    return;
  }

  const { 
    machine,
    paymentMethod,
    comment
  } = req.body as { 
    machine: string;
    paymentMethod: string;
    comment: string
  };

  await Timer.updateOne({ _id: id }, {
    machine,
    paymentMethod,
    comment
  })
  
  timer.machine = machine;
  timer.comment = comment;
  timer.paymentMethod = paymentMethod;

  res.status(200).json({ timer });
  next()
});

timersRouter.delete('/:id', async (req, res, next) => {
  const { id } = req.params;
  await Timer.updateOne({ _id: id }, { deletedAt: new Date() })
  res.status(200).json({})
  next();
});