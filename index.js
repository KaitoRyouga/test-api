import Koa from 'koa';
import Router from '@koa/router';
import cors from '@koa/cors';
import bodyParser from 'koa-bodyparser';
import parameter from 'koa-parameter';
import config from './src/config/index.js';
import keys from './src/keys/keys.js';
import Db from './src/models/db.js';

import {
    routes
} from './src/routes/index.js';

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
    .use(router.routes())
    .use(router.allowedMethods());

app.listen(port);