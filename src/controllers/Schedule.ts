import {Request, Response, Router} from 'express';
import { checkAuth } from '@src/utils/checkAthorization';
import SchedulesRespository from '@src/repositories/Schedule';

const router = Router();

router.get('/all', checkAuth, async (req: Request, res: Response) => {
  const {status, mss, data } = await SchedulesRespository.getAllSchedules(req.body.user.id, req.body.filters);
  res.status(status).send(mss ?? data);
});

router.get('/:id', checkAuth, async (req: Request, res: Response) => {
  const {status, mss, data} = await SchedulesRespository.getScheduleById(parseInt(req.params.id), req.body.user.id);
  res.status(status).send(mss ?? data);
});

export default router;