import express, { Request, Response } from 'express';
import { PORT } from './shared/constants/env.contants';
import { connectDatabase } from './database';
import { apiRouter } from './router';

async function bootstrap() {
  const app = express();

  connectDatabase()
    .then(() => console.log('database connected')) 
    .catch((rason) => console.log('error connecting database', rason))

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use('/api', apiRouter);

  app.get('/', (_req, res) => {
    res.status(200).send('hello world!')
  })

  app.listen(PORT, () => {
    console.log(`SERVER ON PORT ${PORT}`)
  });
}

bootstrap();