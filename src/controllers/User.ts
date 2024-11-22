import {Request, Response, Router} from 'express';
import { checkAuth } from '@src/utils/checkAthorization';
import UsersRepository from '@src/repositories/User';

const router = Router();

router.post('/', async (req: Request,res: Response) => {
  const {status, mss, data} = await UsersRepository.createuser(req.body);
  res.status(status).send(mss ?? data);
});

router.delete('/', async (req: Request, res: Response) => {
  const {status, mss, data} = await UsersRepository.deleteUser(req.body);
  res.status(status).send(mss ?? data);
});

router.get('/', checkAuth, async (req: Request, res: Response) => {
  const {status, mss, data} = await UsersRepository.getOwnUser(req.body);
  res.status(status).send(mss ?? data);
});

router.get('/:id', async (req: Request, res: Response) => {
  const {status, mss, data} = await UsersRepository.getUserById( parseInt(req.params.id));
  res.status(status).send(mss ?? data);
});

export default router;