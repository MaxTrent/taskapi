import { Sequelize, DataTypes, Model, Optional } from 'sequelize';

export interface TaskLogAttributes {
  id: number;
  taskId: number;
  startTime: Date;
  endTime: Date;
  duration: number;
  createdAt?: Date;
}

export interface TaskLogCreationAttributes extends Optional<TaskLogAttributes, 'id' | 'createdAt'> {}

export class TaskLog extends Model<TaskLogAttributes, TaskLogCreationAttributes> implements TaskLogAttributes {
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
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: 'TaskLog',
      tableName: 'task_logs',
      timestamps: true,
    }
  );
  return TaskLog;
};