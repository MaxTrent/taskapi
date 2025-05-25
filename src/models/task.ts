import { Sequelize, DataTypes, Model, Optional } from 'sequelize';

export interface TaskAttributes {
  id: number;
  userId: number;
  status: 'pending' | 'in-progress' | 'completed';
  title: string;
  description?: string;
}

export interface TaskCreationAttributes extends Optional<TaskAttributes, 'id'> {}

export class Task extends Model<TaskAttributes, TaskCreationAttributes> implements TaskAttributes {
  public id!: number;
  public userId!: number;
  public status!: 'pending' | 'in-progress' | 'completed';
  public title!: string;
  public description?: string;
}

export const configureTaskModel = (sequelize: Sequelize) => {
  Task.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM('pending', 'in-progress', 'completed'),
        allowNull: false,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: 'Task',
      tableName: 'tasks',
    }
  );
  return Task;
};