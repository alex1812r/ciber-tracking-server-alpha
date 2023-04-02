import { connect } from 'mongoose';
import { DATABASE_URI } from './shared/constants/env.contants';

export async function connectDatabase() {
  const db = await connect(DATABASE_URI)
  return db;
}