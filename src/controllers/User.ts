import express from 'express';
const router = express.Router();
import UsersRepository from '@src/repositories/User';

router.post('/', async (req: express.Request,res: express.Response) => {
  console.log('teste');
  const response = await UsersRepository.createuser(req.body);
  res.status(response.status).send(response.mss);
});

export default router;