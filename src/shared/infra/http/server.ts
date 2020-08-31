import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
const app = express();

app.use(cors());
app.listen(3333, () => {
  console.log('Server started on port 3333!');
});
