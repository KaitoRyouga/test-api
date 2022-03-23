import { DB } from '../models/index.mjs';
const User = DB.user;

export class verifySignUp {

    checkDuplicateUsername = async (ctx, next) => {

        const user = await User.findOne({
            where: {
                username: ctx.request.body.username
            }
        })

        if (user) {
            console.log(user);
            ctx.throw(400, "Username already exists");
        } else {
            await next();
        }
    };

    updateUser = async (ctx, next) => {

        const userCurrent = await User.findOne({
            where: {
                id: ctx.params.id
            }
        })

        const user = await User.findOne({
            where: {
                username: ctx.request.body.username
            }
        })

        if (user && user.id !== userCurrent.id) {

            ctx.throw(400, "Username already exists");
        } else {

            next();
        }
    }

}