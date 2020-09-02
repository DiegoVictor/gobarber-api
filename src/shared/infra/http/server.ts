import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { errors } from 'celebrate';

const app = express();

app.use(cors());
app.use(helmet());

app.use(errors());
app.listen(3333, () => {
  console.log('Server started on port 3333!');
});
