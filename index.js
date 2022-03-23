import Koa from 'koa';
import Router from '@koa/router';
import session from 'koa-session';
import cors from '@koa/cors';
import bodyParser from 'koa-bodyparser';
import parameter from 'koa-parameter';
import config from './src/config/index.js';
import keys from './src/keys/keys.js';

import {
    routes
} from './src/routes/index.js';
import {
    createStore
} from './src/services/index.js';

const port = config('PORT_DEV');
const app = new Koa();
const router = new Router({
    prefix: '/api'
});

routes(router);
parameter(app);

app.keys = [keys.secret]

app
    .use(bodyParser())
    .use(cors())
    .use(session({
        key: 'data:data',
        maxAge: 1000 * 60,
        store: createStore()
    }, app))
    .use(router.routes())
    .use(router.allowedMethods());

app.listen(port);