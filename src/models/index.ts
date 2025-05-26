import { Sequelize } from 'sequelize';
import { configureUserModel } from './user';
import { configureTaskModel } from './task';
import { configureTaskLogModel } from './taskLog';
import { createLogger } from '../utils/logger';
import { config } from '../config';

const logger = createLogger('database');

const sequelize = new Sequelize(config.DOCKER_DATABASE_URL, {
  dialect: 'postgres',
  logging: (msg) => logger.info(msg),
});

const User = configureUserModel(sequelize);
const Task = configureTaskModel(sequelize);
const TaskLog = configureTaskLogModel(sequelize);

User.hasMany(Task, { foreignKey: 'userId' });
Task.belongsTo(User, { foreignKey: 'userId' });
Task.hasMany(TaskLog, { foreignKey: 'taskId' });
TaskLog.belongsTo(Task, { foreignKey: 'taskId' });

const syncDatabase = async () => {
  try {
    await sequelize.authenticate();
    logger.info('Database connection established');
    await sequelize.sync({ alter: true });
    logger.info('Database synchronized');
  } catch (error) {
    logger.error('Database connection failed', { error });
    throw error;
  }
};

export { sequelize, User, Task, TaskLog, syncDatabase };