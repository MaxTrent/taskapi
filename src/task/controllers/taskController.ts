import { Request, Response } from 'express';
import { createTask, getTasks, updateTask, deleteTask, trackTime, getTimeReport, getCompletionReport } from '../services/taskService';
import { createLogger } from '../../utils/logger';
import { AppError } from '../../utils/errors';
import { AuthRequest } from '../../middleware/authMiddleware';
import { TaskCreateInput, TaskUpdateInput, TimeTrackInput } from '../schemas';

const logger = createLogger('taskController');

const validStatuses = ['pending', 'in-progress', 'completed'] as const;
type TaskStatus = typeof validStatuses[number];

const validateStatus = (status: unknown): TaskStatus | undefined => {
  if (typeof status === 'string' && validStatuses.includes(status as TaskStatus)) {
    return status as TaskStatus;
  }
  return undefined;
};

export const createTaskHandler = async (req: Request<{}, {}, TaskCreateInput>, res: Response) => {
  logger.info('Handling create task', { userId: (req as AuthRequest).user!.id, input: req.body });
  const input = req.body;
  if (!input.title) {
    logger.error('Title missing after validation', { input });
    throw new AppError('Title is required', 400, ['Title is required']);
  }
  const task = await createTask((req as AuthRequest).user!.id, input);
  res.status(201).json(task);
};

export const getTasksHandler = async (req: AuthRequest, res: Response) => {
  const status = validateStatus(req.query.status);
  const filter = {
    status,
    page: parseInt(req.query.page as string) || 1,
    limit: parseInt(req.query.limit as string) || 10,
  };
  logger.info('Handling get tasks', { userId: req.user!.id, filter });
  if (req.query.status && !status) {
    logger.warn('Invalid status provided', { status: req.query.status });
    throw new AppError('Invalid status', 400, ['Status must be one of: pending, in-progress, completed']);
  }
  const result = await getTasks(req.user!.id, filter);
  res.status(200).json(result);
};

export const updateTaskHandler = async (req: Request<{ id: string }, {}, TaskUpdateInput>, res: Response) => {
  logger.info('Handling update task', { userId: (req as AuthRequest).user!.id, taskId: req.params.id });
  const task = await updateTask((req as AuthRequest).user!.id, parseInt(req.params.id), req.body);
  res.status(200).json(task);
};

export const deleteTaskHandler = async (req: AuthRequest, res: Response) => {
  logger.info('Handling delete task', { userId: req.user!.id, taskId: req.params.id });
  await deleteTask(req.user!.id, parseInt(req.params.id));
  res.status(204).send();
};

export const trackTimeHandler = async (req: Request<{ id: string }, {}, TimeTrackInput>, res: Response) => {
  logger.info('Handling track time', { userId: (req as AuthRequest).user!.id, taskId: req.params.id });
  const input = {
    startTime: new Date(req.body.startTime),
    endTime: new Date(req.body.endTime),
  };
  const log = await trackTime((req as AuthRequest).user!.id, parseInt(req.params.id), input);
  res.status(201).json(log);
};

export const getTimeReportHandler = async (req: AuthRequest, res: Response) => {
  logger.info('Handling time report', { userId: req.user!.id });
  const report = await getTimeReport(req.user!.id);
  res.status(200).json(report);
};

export const getCompletionReportHandler = async (req: AuthRequest, res: Response) => {
  logger.info('Handling completion report', { userId: req.user!.id });
  const report = await getCompletionReport(req.user!.id);
  res.status(200).json(report);
};