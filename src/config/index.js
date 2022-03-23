import dotenv from 'dotenv'
import {
    sendError
} from '../models/Response.js'

dotenv.config()

const config = (key) => {

    const value = process.env[key];

    if (!value) {
        // return sendError(ctx, 'config', key, 500);
        // return sendError(key, 500);
        console.log(`${key} is not defined in .env`);
    }

    return value
}

export default config