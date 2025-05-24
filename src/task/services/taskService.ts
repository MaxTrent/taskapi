import { Op } from 'sequelize';
import { Task, TaskLog } from '../../models';
import { createLogger } from '../../utils/logger';
import { AppError } from '../../utils/errors';
import { TaskCreateInput } from '../schemas';

const logger = createLogger('taskService');

interface TaskFilter {
  status?: 'pending' | 'in-progress' | 'completed';
  page?: number;
  limit?: number;
}

interface TimeTrackInput {
  startTime: Date;
  endTime: Date;
}

export const createTask = async (userId: number, input: TaskCreateInput) => {
  logger.info('Creating task', { userId, input });
  const task = await Task.create({ ...input, userId });
  logger.info('Task created', { taskId: task.id });
  return task;
};

export const getTasks = async (userId: number, filter: TaskFilter) => {
  const { status, page = 1, limit = 10 } = filter;
  logger.info('Fetching tasks', { userId, filter });
  const where: any = { userId };
  if (status) where.status = status;
  const offset = (page - 1) * limit;
  const { count, rows } = await Task.findAndCountAll({
    where,
    limit,
    offset,
    order: [['createdAt', 'DESC']],
  });
  logger.info('Tasks fetched', { count, page, limit });
  return { tasks: rows, total: count, page, limit };
};

export const updateTask = async (userId: number, taskId: number, input: Partial<TaskCreateInput>) => {
  logger.info('Updating task', { userId, taskId, input });
  const task = await Task.findOne({ where: { id: taskId, userId } });
  if (!task) {
    logger.warn('Task not found', { taskId, userId });
    throw new AppError('Task not found', 404);
  }
  const updatedTask = await task.update(input);
  logger.info('Task updated', { taskId });
  return updatedTask;
};

export const deleteTask = async (userId: number, taskId: number) => {
  logger.info('Deleting task', { userId, taskId });
  const task = await Task.findOne({ where: { id: taskId, userId } });
  if (!task) {
    logger.warn('Task not found', { taskId, userId });
    throw new AppError('Task not found', 404);
  }
  await task.destroy();
  logger.info('Task deleted', { taskId });
};

export const trackTime = async (userId: number, taskId: number, { startTime, endTime }: TimeTrackInput) => {
  logger.info('Tracking time', { userId, taskId, startTime, endTime });
  const task = await Task.findOne({ where: { id: taskId, userId } });
  if (!task) {
    logger.warn('Task not found', { taskId, userId });
    throw new AppError('Task not found', 404);
  }
  const duration = (endTime.getTime() - startTime.getTime()) / 1000; // seconds
  const log = await TaskLog.create({ taskId, startTime, endTime, duration });
  logger.info('Time tracked', { logId: log.id, duration });
  return log;
};

export const getTimeReport = async (userId: number) => {
  logger.info('Generating time report', { userId });
  const logs = await TaskLog.findAll({
    include: [{ model: Task, where: { userId } }],
  });
  const totalTime = logs.reduce((sum, log) => sum + log.duration, 0);
  logger.info('Time report generated', { userId, totalTime });
  return { logs, totalTime };
};

export const getCompletionReport = async (userId: number) => {
  logger.info('Generating completion report', { userId });
  const tasks = await Task.findAll({ where: { userId } });
  const total = tasks.length;
  const completed = tasks.filter((task) => task.status === 'completed').length;
  const rate = total > 0 ? (completed / total) * 100 : 0;
  logger.info('Completion report generated', { userId, total, completed, rate });
  return { total, completed, rate };
};