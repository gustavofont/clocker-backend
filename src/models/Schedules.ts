import DBConnetion from '@models/DBConnection';
import { DataTypes } from 'sequelize';

const schedules = DBConnetion.define('schedules', {
  title: DataTypes.TEXT,
  description: DataTypes.TEXT,
  tag: DataTypes.TEXT,
  user: DataTypes.INTEGER,
  notify: DataTypes.BOOLEAN,
  allDay: DataTypes.BOOLEAN,
  startTime: DataTypes.DATE,
  endTime: DataTypes.DATE,
  createdAt: DataTypes.DATE,
  updatedAt: DataTypes.DATE,
});

export default schedules;