import {Request, Response, Router} from 'express';
import AuthRepository from '@src/repositories/Auth';

const router = Router();

router.post('/signin', async(req:Request, res:Response)=> {
  const {status, mss, data} = await AuthRepository.signin(req.body);
  res.status(status).send(mss ?? data);
});

router.post('/');

export default router;