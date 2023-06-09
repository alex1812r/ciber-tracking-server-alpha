import { Schema, model } from "mongoose";
import moment from 'moment';

export const TimerSchema = new Schema({
  startAt: Date,
  endAt: Date,
  machine: String,
  minutes: Number,
  hours: Number,
  amount: Number,
  addControl: {
    type: Boolean,
    default: false,
  },
  deletedAt: Date,
  comment: String,
  paymentMethod: String
}, { timestamps: true })

TimerSchema.pre('save', function() {
  console.log('pre save')
  // if(this.startAt && this.endAt) {
  //   const moment1 = moment(this.startAt);
  //   const moment2 = moment(this.endAt);
  //   const hours = moment2.diff(moment1, 'hours');
  //   const moment2SubstractedHours = moment2.subtract(hours, 'hours');
  //   const minutes = moment2SubstractedHours.diff(moment1, 'minutes');
  //   this.hours = hours;
  //   this.minutes = minutes;

  //   const minutes30Count = Math.ceil(minutes / 30)

  //   const amount = (hours * 2) + (minutes30Count * 1);
  //   this.amount = amount;
  // }
  if(typeof this.minutes === 'number' && typeof this.hours === 'number') {
    const minutes30Count = Math.ceil(this.minutes / 30)
    const amount = (this.hours * 2) + minutes30Count;
    this.startAt = moment().toDate();
    this.endAt = moment(this.startAt).add(this.minutes, 'minutes').add(this.hours, 'hours').toDate();
    this.amount = amount;
    if (this.addControl) {
      this.amount += this.hours + minutes30Count;
    }
  }

});

export const Timer = model('Timer', TimerSchema);