import jwt from 'jsonwebtoken';
import keys from '../keys/keys.js';
import {
    sendError
} from '../models/Response.js';

const verifyToken = async (ctx, next) => {

    try {

        const token = ctx.request.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, keys.JWT_SECRET);

        ctx.session.user = decoded;

        await next();

    } catch (error) {

        sendError(ctx, 'verifyToken', 'token', 401, 'Unauthorized');

    }

}

export default verifyToken;