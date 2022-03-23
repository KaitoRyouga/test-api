import Sequelize from 'sequelize';
import config from '../config/index.js';
import { sendError } from './Response.js';

const Db = new Sequelize(
    config('DB_NAME'),
    config('DB_USER'),
    config('DB_PASS'), {
        host: config('DB_HOST'),
        dialect: config('DB_DRIVER'),
        port: config('DB_PORT'),
        dialectOptions: {
            charset: 'utf8mb4',
            collate: 'utf8mb4_unicode_ci',
            useUTC: false
        },
        timezone: config('DB_TIMEZONE'),
        pool: {
            max: 5,
            min: 0,
            idle: 10000
        },
        logging: (...msg) => console.log(msg)
    }
);

Db
    .authenticate()
    .then(() => {
        console.log('Connection has been established successfully.');
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
        sendError(ctx, "db", "", 500);
    });

export default Db;