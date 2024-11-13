import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
dotenv.config();

const database:string = process.env.MYSQL_DATABASE ?? '';
const dbUser:string = process.env.MYSQL_USER ?? '';
const userPassword:string = process.env.MYSQL_PASSWORD ?? '';
const host = process.env.MYSQL_HOST ?? '';

const sequelize = new Sequelize(database, dbUser, userPassword, {
  host,
  dialect: 'mysql',
});

export default sequelize;

