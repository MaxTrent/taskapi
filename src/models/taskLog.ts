import { Sequelize, DataTypes, Model } from 'sequelize';

export interface TaskLogAttributes {
  id: number;
  taskId: number;
  startTime: Date;
  endTime: Date;
  duration: number;
  createdAt?: Date;
}

export class TaskLog extends Model<TaskLogAttributes> implements TaskLogAttributes {
  public id!: number;
  public taskId!: number;
  public startTime!: Date;
  public endTime!: Date;
  public duration!: number;
  public readonly createdAt!: Date;
}

export const configureTaskLogModel = (sequelize: Sequelize) => {
  TaskLog.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      taskId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'tasks', key: 'id' },
      },
      startTime: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      endTime: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      duration: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'TaskLog',
      tableName: 'task_logs',
    }
  );
  return TaskLog;
};