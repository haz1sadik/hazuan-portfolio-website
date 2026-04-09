import "dotenv/config";
import { Sequelize } from "sequelize";

const {
  DATABASE_HOST,
  DATABASE_NAME,
  DATABASE_USER,
  DATABASE_PASSWORD,
} = process.env;

const config = {
    host: DATABASE_HOST,
    dialect: "postgres",
    timezone: "+08:00",
    logging: false,
    dialectOptions: {
        useUTC: true,
    },
    pool: {
        max: 15,
        min: 0,
        idle: 10000,
    },
};

const sequelize = new Sequelize(DATABASE_NAME, DATABASE_USER, DATABASE_PASSWORD, config);

export default sequelize;