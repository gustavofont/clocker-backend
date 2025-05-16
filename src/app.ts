import express, { Request, Response } from 'express';
import UserController from '@controllers/User';
import AuthController from '@controllers/Auth';
import ScheduleController from '@controllers/Schedule';
import cors from 'cors';

const app = express();
 
app.use(cors());
 
app.use(express.json());

app.use('/', AuthController);

app.use('/user', UserController);

app.use('/schedule', ScheduleController);
 
app.use((req: Request, res: Response) => {
  res.send('Hello World');
});
 
app.use((error: Error, req: Request, res: Response) => {
  res.status(500).send(error.message);
});
 
export default app;