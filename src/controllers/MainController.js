import {
    sendError,
    sendResponse
} from '../models/Response.js';

const list = async (ctx, model, controller) => {

    try {

        let data;

        if (ctx.session.data && ctx.session.data?.[model.name]?.list) {
            data = ctx.session.data[model.name].list;
        } else {
            data = await model.findAll({
                where: {
                    status: true
                }
            });
            ctx.session.data = {
                ...ctx.session.data,
                [model.name]: {
                    ...ctx.session.data?.[model.name],
                    list: data
                }
            };
        }


        sendResponse(ctx, 200, "get data success !", data);

    } catch (error) {
        sendError(ctx, "list " + controller, "", 500, error.message);
    }
}

const detail = async (ctx, model, controller) => {

    try {

        let data;

        if (ctx.session.data && ctx.session.data?.[model.name]?.detail?.[ctx.params.id]) {
            data = ctx.session.data[model.name].detail[ctx.params.id];
        } else {
            data = await model.findOne({
                where: {
                    id: ctx.params.id,
                    status: true
                }
            });

            ctx.session.data = {
                ...ctx.session.data,
                [model.name]: {
                    ...ctx.session.data?.[model.name],
                    detail: {
                        ...ctx.session.data?.[model.name]?.detail,
                        [ctx.params.id]: data
                    }
                }
            }
        }

        sendResponse(ctx, 200, "get data success !", data);
    } catch (error) {
        sendError(ctx, "detail " + controller, "", 404, error.message);
    }
}

const create = async (ctx, model, controller) => {

    try {

        const data = await model.create(ctx.request.body);

        if (ctx.session.data && ctx.session.data?.[model.name]?.list) {
            ctx.session.data = {
                ...ctx.session.data,
                [model.name]: {
                    ...ctx.session.data?.[model.name],
                    list: {
                        ...ctx.session.data?.[model.name]?.list,
                        data
                    },
                    detail: {
                        ...ctx.session.data?.[model.name]?.detail,
                        [data.id]: data
                    }
                }
            };
        }

        sendResponse(ctx, 200, "create data success !", data);

    } catch (error) {
        sendError(ctx, "create " + controller, "", 500, error.message);
    }
}

const update = async (ctx, model, controller) => {

    try {

        model.update(ctx.request.body, {
            where: {
                id: ctx.params.id
            }
        });

        if (ctx.session.data && ctx.session.data?.[model.name]?.list) {
            ctx.session.data[model.name].list = ctx.session.data[model.name].list.map(item => {
                if (item.id === ctx.params.id) {
                    return ctx.request.body;
                }
                return item;
            });
        }

        if (ctx.session.data && ctx.session.data?.[model.name]?.detail?.[ctx.params.id]) {
            ctx.session.data[model.name].detail[ctx.params.id] = ctx.request.body;
        }

        sendResponse(ctx, 200, "update data success !", data);
    } catch (error) {
        sendError(ctx, "update " + controller, "", 404, error.message);
    }
}

const destroy = async (ctx, model, controller) => {

    try {

        model.destroy({
            where: {
                id: ctx.params.id
            }
        });

        if (ctx.session.data && ctx.session.data?.[model.name]?.list) {
            ctx.session.data[model.name].list = ctx.session.data[model.name].list.filter(item => item.id !== ctx.params.id);
        }

        if (ctx.session.data && ctx.session.data?.[model.name]?.detail) {
            ctx.session.data[model.name].detail = ctx.session.data[model.name].detail.filter(item => item.id !== ctx.params.id);
        }

        sendResponse(ctx, 200, "delete data success !", data);
    } catch (error) {
        sendError(ctx, "destroy " + controller, "", 404, error.message);
    }
}

export {
    list,
    detail,
    create,
    update,
    destroy
}