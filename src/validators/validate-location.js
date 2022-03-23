import {
    Location
} from '../models/index.js';

const createLocation = async (ctx, next) => {

    ctx.verifyParams({
        parent_id: {
            type: 'integer',
            required: false
        },
        name: {
            type: 'string',
            required: true,
        },
        type: {
            type: 'integer',
            required: true,
            in: [Location.TYPE_PROVINCE, Location.TYPE_DISTRICT, Location.TYPE_WARD]
        },
    });

    await next();
}

const updateLocation = async (ctx, next) => {

    ctx.verifyParams({
        parent_id: {
            type: 'integer',
            required: false
        },
        name: {
            type: 'string',
            required: true,
        },
        type: {
            type: 'integer',
            required: true,
            in: [Location.TYPE_PROVINCE, Location.TYPE_DISTRICT, Location.TYPE_WARD]
        },
    });

    await next();
}

export {
    createLocation,
    updateLocation
}