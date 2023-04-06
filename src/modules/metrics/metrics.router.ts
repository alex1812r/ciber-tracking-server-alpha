import { Router } from "express";
import moment from "moment";
import { Timer } from "../timers/schemas/timer.schema";

export const metricsRouter = Router();

metricsRouter.get('/', async (req, res, next) => {
  const { date } = req.query as { date?: string };

  const weekStart = moment(date).startOf("isoWeek");
  const weekEnd = moment(date).endOf("isoWeek");

  const timers = await Timer.find().where({
    deletedAt: null,
    startAt: {
      $gte: weekStart.toDate(), 
      $lt: weekEnd.toDate()
    }
  })

  let amountTotal = 0;
  const week: { [k: string]: number } = {
    monday: 0,
    tuesday: 0,
    wednesday: 0,
    thursday: 0,
    friday: 0,
    saturday: 0,
    sunday: 0,
  }

  const machinesUseCountMap: { [k: string]: number; } = {}

  timers.forEach((t) => {
    const day = moment(t.startAt).format('dddd').toLocaleLowerCase() || '';
    week[day] += t.amount || 0; 
    amountTotal += t.amount || 0;
    if(!machinesUseCountMap[t.machine || '']) machinesUseCountMap[t.machine || ''] = 0 
    machinesUseCountMap[t.machine || ''] += 1;
  });

  const machinesUseCountMapValues = Object.values(machinesUseCountMap)
  const machinesUse = Object.keys(machinesUseCountMap).map((machine, i) => {
    const val = machinesUseCountMapValues[i];
    const percentage = (val * 100) / timers.length 
    return {
      machine,
      percentage,
    }
  })

  res.status(200).json({
    metrics: {
      week,
      machinesUse,
      amountTotal
    }
  });
  next();
})