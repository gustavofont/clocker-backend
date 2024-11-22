import express, { Request, Response } from 'express';
import UserControlle from '@controllers/User';
import AuthControlle from '@controllers/Auth';
import cors from 'cors';

const app = express();
 
app.use(cors());
 
app.use(express.json());

app.use('/', AuthControlle);

app.use('/user', UserControlle);
 
app.use((req: Request, res: Response) => {
  res.send('Hello World');
});
 
app.use((error: Error, req: Request, res: Response) => {
  res.status(500).send(error.message);
});
 
export default app;