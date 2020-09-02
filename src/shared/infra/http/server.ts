import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
const app = express();

app.use(cors());
app.use(helmet());
app.listen(3333, () => {
  console.log('Server started on port 3333!');
});
