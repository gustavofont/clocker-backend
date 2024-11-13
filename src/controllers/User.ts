import {Request, Response, Router} from 'express';
const router = Router();
import UsersRepository from '@src/repositories/User';

router.post('/', async (req: Request,res: Response) => {
  const {status, mss} = await UsersRepository.createuser(req.body);
  res.status(status).send(mss);
});

router.delete('/', async (req: Request, res: Response) => {
  const {status, mss} = await UsersRepository.deleteUser(req.body);
  res.status(status).send(mss);
});

export default router;