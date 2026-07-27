import "dotenv/config";
import { Sequelize } from "sequelize";

const {
  DATABASE_HOST,
  DATABASE_NAME,
  DATABASE_USER,
  DATABASE_PASSWORD,
  DATABASE_PORT,
} = process.env;

const config = {
    host: DATABASE_HOST,
    dialect: "postgres",
    port: DATABASE_PORT ? parseInt(DATABASE_PORT) : 24707,
    timezone: "+08:00",
    logging: false,
    dialectOptions: {
        useUTC: true,
        ssl: {
            require: true,
            rejectUnauthorized: false,
        }
    },
    pool: {
        max: 15,
        min: 0,
        idle: 10000,
    },
};

const sequelize = new Sequelize(DATABASE_NAME, DATABASE_USER, DATABASE_PASSWORD, config);

export default sequelize;