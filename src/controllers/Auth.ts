import {Request, Response, Router} from 'express';
import AuthRepository from '@src/repositories/Auth';
import { checkAuth } from '@src/utils/checkAthorization';

const router = Router();

router.post('/signin', async(req:Request, res:Response)=> {
  const {status, mss, data} = await AuthRepository.signin(req.body);
  res.status(status).send(mss ?? data);
});

router.post('/signup', async (req: Request,res: Response) => {
  const {status, mss, data} = await AuthRepository.signup(req.body);
  res.status(status).send(mss ?? data);
});

router.post('/validate-token', checkAuth, (req:Request, res: Response) => {
  res.status(200).send('token valid');
});

export default router;