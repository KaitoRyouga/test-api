import {
    Location
} from '../models/index.js';
import {
    sendError,
    sendResponse
} from '../models/Response.js';

const list = async (ctx) => {

    try {

        let data;

        if (ctx.session.data && ctx.session.data?.[Location.name]?.list) {
            data = ctx.session.data[Location.name].list;
        } else {

            data = await Location.findAll({
                where: {
                    status: true
                }
            });

            ctx.session.data = {
                ...ctx.session.data,
                [Location.name]: {
                    ...ctx.session.data?.[Location.name],
                    list: data
                }
            };
        }


        sendResponse(ctx, 200, "get data success !", data);

    } catch (error) {
        sendError(ctx, "list location", "", 500, error.message);
    }
}

const detail = async (ctx) => {

    try {

        let data;

        if (ctx.session.data && ctx.session.data?.[Location.name]?.detail?.[ctx.params.id]) {
            data = ctx.session.data[Location.name].detail[ctx.params.id];
        } else {
            data = await Location.findOne({
                where: {
                    id: ctx.params.id,
                    status: true
                }
            });

            ctx.session.data = {
                ...ctx.session.data,
                [Location.name]: {
                    ...ctx.session.data?.[Location.name],
                    detail: {
                        ...ctx.session.data?.[Location.name]?.detail,
                        [ctx.params.id]: data
                    }
                }
            }
        }

        sendResponse(ctx, 200, "get data success !", data);
    } catch (error) {
        sendError(ctx, "detail location", "", 404, error.message);
    }
}

const create = async (ctx) => {

    try {

        const data = await Location.create(ctx.request.body);

        if (ctx.session.data && ctx.session.data?.[Location.name]?.list) {
            ctx.session.data = {
                ...ctx.session.data,
                [Location.name]: {
                    ...ctx.session.data?.[Location.name],
                    list: {
                        ...ctx.session.data?.[Location.name]?.list,
                        data
                    },
                    detail: {
                        ...ctx.session.data?.[Location.name]?.detail,
                        [data.id]: data
                    }
                }
            };
        }

        sendResponse(ctx, 200, "create data success !", data);

    } catch (error) {
        sendError(ctx, "create location", "", 500, error.message);
    }
}

const update = async (ctx) => {

    try {

        Location.update(ctx.request.body, {
            where: {
                id: ctx.params.id
            }
        });

        if (ctx.session.data && ctx.session.data?.[Location.name]?.list) {
            ctx.session.data[Location.name].list = ctx.session.data[Location.name].list.map(item => {
                if (item.id === ctx.params.id) {
                    return ctx.request.body;
                }
                return item;
            });
        }

        if (ctx.session.data && ctx.session.data?.[Location.name]?.detail?.[ctx.params.id]) {
            ctx.session.data[Location.name].detail[ctx.params.id] = ctx.request.body;
        }

        sendResponse(ctx, 200, "update data success !", data);
    } catch (error) {
        sendError(ctx, "update location", "", 404, error.message);
    }
}

const destroy = async (ctx) => {

    try {

        Location.destroy({
            where: {
                id: ctx.params.id
            }
        });

        if (ctx.session.data && ctx.session.data?.[Location.name]?.list) {
            ctx.session.data[Location.name].list = ctx.session.data[Location.name].list.filter(item => item.id !== ctx.params.id);
        }

        if (ctx.session.data && ctx.session.data?.[Location.name]?.detail) {
            ctx.session.data[Location.name].detail = ctx.session.data[Location.name].detail.filter(item => item.id !== ctx.params.id);
        }

        sendResponse(ctx, 200, "delete data success !");
    } catch (error) {
        sendError(ctx, "destroy location", "", 404, error.message);
    }
}

export {
    list,
    detail,
    create,
    update,
    destroy
}