import express, { Request, Response, NextFunction } from 'express';
const app = express();

app.listen(3333, () => {
  console.log('Server started on port 3333!');
});
