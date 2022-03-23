import redisStore from 'koa-redis';
import config from '../config/index.js';

const createStore = () => {
    return new redisStore({
        host: config('REDIS_HOST'),
        port: config('REDIS_PORT')
    });
}

export {
    createStore
}