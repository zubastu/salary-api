import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();
import express from 'express';
import cookieParser from 'cookie-parser';
import { errors } from 'celebrate';

import { errorLogger, requestLogger } from './middlewares/logger';
import { dbConnect } from './salaryManager/init';
import router from './salaryManager/routes/routes';

const port = Number(process.env.SERVER_PORT) || 3005;

async function startServer() {
  const app = express();
  app.use(requestLogger);
  app.use(
    cors({
      origin: '*',
    }),
  );

  app.use(express.json());
  app.use(cookieParser());
  app.use('/', router);
  app.use(errors());
  app.use(errorLogger); // error logger

  app.listen(port);
}
dbConnect().then(() => {
  startServer().then(() => {
    console.log(
      `  ➜ 🎸 Server is listening on port: ${port}`,
      `http://localhost:${port}/`,
    );
  });
});
