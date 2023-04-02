import { Schema, model } from "mongoose";
import moment from 'moment';

export const TimerSchema = new Schema({
  startAt: Date,
  endAt: Date,
  machine: String,
  minutes: Number,
  hours: Number,
  amount: Number,
  deletedAt: Date,
}, { timestamps: true })

TimerSchema.pre('save', function() {
  if(this.startAt && this.endAt) {
    const moment1 = moment(this.startAt);
    const moment2 = moment(this.endAt);
    const hours = moment2.diff(moment1, 'hours');
    const moment2SubstractedHours = moment2.subtract(hours, 'hours');
    const minutes = moment2SubstractedHours.diff(moment1, 'minutes');
    this.hours = hours;
    this.minutes = minutes;

    const minutes30Count = Math.ceil(minutes / 30)

    const amount = (hours * 2) + (minutes30Count * 1);
    this.amount = amount;
  }
});

export const Timer = model('Timer', TimerSchema);