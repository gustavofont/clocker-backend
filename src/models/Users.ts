import DBConnetion from '@models/DBConnection';
import { DataTypes } from 'sequelize';

const users = DBConnetion.define('users', {
  name: DataTypes.TEXT,
  email: DataTypes.TEXT,
  password: DataTypes.TEXT,
  token: DataTypes.TEXT,
  active: DataTypes.BOOLEAN,
  createdAt: DataTypes.DATE,
  updatedAt: DataTypes.DATE,
});

export default users;