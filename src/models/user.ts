import { Sequelize, DataTypes, Model, Optional } from 'sequelize';

   export interface UserAttributes {
     id: number;
     email: string;
     password: string;
     role: 'user' | 'admin';
     phone?: string;
     isVerified?: boolean;
     otp?: string | null;
     createdAt?: Date;
     updatedAt?: Date;
   }

   export interface UserCreationAttributes extends Optional<UserAttributes, 'id' | 'createdAt' | 'updatedAt' | 'phone' | 'isVerified' | 'otp'> {}

   export class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
     public id!: number;
     public email!: string;
     public password!: string;
     public role!: 'user' | 'admin';
     public phone?: string;
     public isVerified?: boolean;
     public otp?: string | null;
     public readonly createdAt!: Date;
     public readonly updatedAt!: Date;
   }

   export const configureUserModel = (sequelize: Sequelize) => {
     User.init(
       {
         id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
         email: { type: DataTypes.STRING, allowNull: false, unique: true, validate: { isEmail: true } },
         password: { type: DataTypes.STRING, allowNull: false },
         role: { type: DataTypes.ENUM('user', 'admin'), defaultValue: 'user' },
         phone: { type: DataTypes.STRING, allowNull: true },
         isVerified: { type: DataTypes.BOOLEAN, defaultValue: false },
         otp: { type: DataTypes.STRING, allowNull: true },
       },
       {
         sequelize,
         modelName: 'User',
         tableName: 'users',
         timestamps: true,
       }
     );
     return User;
   };