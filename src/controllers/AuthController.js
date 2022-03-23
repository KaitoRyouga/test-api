import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken';

import keys from '../keys/keys.js';
import {
    User
} from '../models/index.js';
import {
    sendError,
    sendResponse
} from '../models/Response.js';

const login = async (ctx) => {

    try {

        const user = await User.findOne({
            where: {
                username: ctx.request.body.username,
                is_login: false
            }
        });

        console.log(user);

        if (!user) {
            sendError(ctx, 'login', 'username', 400, 'Login fail !');
        } else {
            const passwordIsValid = bcrypt.compareSync(
                ctx.request.body.password,
                user.password
            );

            if (!passwordIsValid) {
                sendError(ctx, 'login', 'password', 403, 'Login fail !');
            } else {

                const token = jwt.sign({
                    id: user.id,
                    username: user.username
                }, keys.JWT_SECRET, {
                    expiresIn: '1h'
                });

                await User.update({
                    is_login: true
                }, {
                    where: {
                        id: user.id
                    }
                });

                ctx.session.user = user;
                sendResponse(ctx, 200, 'Login success !', token);
            }
        }
    } catch (error) {
        sendError(ctx, 'login', null, 404, error.message);
    }
}

const logout = async (ctx) => {

    try {

        const user = await User.findOne({
            where: {
                id: ctx.session.user.id
            }
        });

        if (!user) {
            sendError(ctx, 'logout', 'user', 404, 'User not found !');
        } else {

            await DB.user.update({
                is_login: false
            }, {
                where: {
                    id: user.id
                }
            });

            ctx.session.user = null;
            sendResponse(ctx, 200, 'Logout success !');
        }

    } catch (error) {
        sendError(ctx, 'logout', null, 404, error.message);
    }
}

export {
    login,
    logout
}