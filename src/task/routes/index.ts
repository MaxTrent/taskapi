import { Router } from 'express';
import {
  createTaskHandler,
  getTasksHandler,
  updateTaskHandler,
  deleteTaskHandler,
  trackTimeHandler,
  getTimeReportHandler,
  getCompletionReportHandler,
} from '../controllers/taskController';
import { authMiddleware } from '../../middleware/authMiddleware';
import { roleMiddleware } from '../../middleware/roleMiddleware';
import { validate } from '../../middleware/validate';
import { taskCreateSchema, taskUpdateSchema, timeTrackSchema } from '../schemas';

const router = Router();

router.use(authMiddleware);

router.post('/', validate(taskCreateSchema), createTaskHandler);
router.get('/', getTasksHandler);
router.put('/:id', validate(taskUpdateSchema), updateTaskHandler);
router.delete('/:id', deleteTaskHandler);
router.post('/:id/time', validate(timeTrackSchema), trackTimeHandler);
router.get('/report/time', getTimeReportHandler);
router.get('/report/completion', roleMiddleware(['admin']), getCompletionReportHandler);

export default router;