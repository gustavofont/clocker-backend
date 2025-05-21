import {Request, Response, Router} from 'express';
import { checkAuth } from '@src/utils/checkAthorization';
import SchedulesRespository from '@src/repositories/Schedule';
import ScheduleRepository from '@src/repositories/Schedule';
import { CalendarFilters, Filters } from '@src/types';

const router = Router();

router.get('/all', checkAuth, async (req: Request, res: Response) => {
  const {status, mss, data } = await SchedulesRespository.getAllSchedules(req.body.user.id, req.query.filters as Filters);
  res.status(status).send(mss ?? data);
});

router.get('/calendar', checkAuth, async (req:Request, res: Response) => {
  const {status, mss, data} = await SchedulesRespository.getCalendar(req.body.user.id, req.query.filters as unknown as CalendarFilters );
  res.status(status).send(mss ?? data);
});

router.get('/:id', checkAuth, async (req: Request, res: Response) => {
  const {status, mss, data} = await SchedulesRespository.getScheduleById(parseInt(req.params.id), req.body.user.id);
  res.status(status).send(mss ?? data);
});

router.post('/', checkAuth, async(req: Request, res: Response) => {
  const {status, mss, data} = await ScheduleRepository.createNewSchedule(req.body.form, req.body.user.id);
  res.status(status).send(mss ?? data);
});

router.delete('/', checkAuth, async(req: Request, res: Response) => {
  const {status, mss, data} = await ScheduleRepository.deleteSchedule(req.body.user.id, req.query.scheduleId as unknown as number);
  res.status(status).send(mss ?? data);
});

export default router;