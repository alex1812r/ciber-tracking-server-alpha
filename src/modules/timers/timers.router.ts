import { Router } from 'express';
import { Timer } from './schemas/timer.schema';
import moment from 'moment';

export const timersRouter = Router();

timersRouter.get('/', async (req, res, next) => {
  const { date } = req.query as { date?: string };
  const where = {
    deletedAt: null,
    startAt: {
      $gte: moment(moment(date).format('DD/MM/YYYY 00:00:01')).toDate(), 
      $lt: moment(moment(date).format('DD/MM/YYYY 23:59:59')).toDate()
    }
  }

  const [timers, count] = await Promise.all([
    Timer
      .find()
      .where(where)
      .sort({ createdAt: 'desc' }),
      Timer.count()
        .where(where)
  ])
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