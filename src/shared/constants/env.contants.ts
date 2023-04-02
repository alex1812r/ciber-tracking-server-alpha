import { config } from 'dotenv'

config()

export const PORT = process.env.PORT ? (+process.env.PORT || 8000) : 8000;
export const DATABASE_URI = process.env.DATABASE_URI || '';