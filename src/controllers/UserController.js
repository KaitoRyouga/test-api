import {
    User,
    Location
} from '../models/index.js';
import {
    detail as detailUser,
    update as updateUser,
    destroy as destroyUser
} from './MainController.js';
import {
    sendError,
    sendResponse
} from '../models/Response.js';

import exportExcel from '../services/export.js';
import bcrypt from 'bcryptjs'

const list = async (ctx, next) => {

    try {

        const listFilter = ['province_id', 'district_id', 'ward_id', 'username', 'id'];
        let filter = {};

        for (const [key, value] of Object.entries(ctx.query)) {
            if (listFilter.includes(key)) {
                filter[key] = value;
            }
        }

        let data;

        if (ctx.session.data && ctx.session.data?.[User.name]?.list) {

            const dataTotal = [];
            if (filter) {
                for (const [key, value] of Object.entries(filter)) {
                    ctx.session.data[User.name].list.map(item => {
                        if (item?.[key.split('_')[0]].id == value) {
                            dataTotal.push(item);
                        }
                    });
                }
            }

            data = dataTotal;
        } else {
            data = await User.findAll({
                where: {
                    ...filter
                },
                attributes: ['id', 'username', 'fullname', 'birthdate', 'address'],
                include: [{
                    model: Location,
                    as: 'province',
                    attributes: ['id', 'name']
                }, {
                    model: Location,
                    as: 'district',
                    attributes: ['id', 'name']
                }, {
                    model: Location,
                    as: 'ward',
                    attributes: ['id', 'name']
                }]
            });

            ctx.session.data = {
                ...ctx.session.data,
                [User.name]: {
                    ...ctx.session.data?.[User.name],
                    list: data
                }
            };
        }

        if (ctx.query.export !== undefined && ctx.query.export === 'true') {
            await exportExcel(ctx, data, 'users');
        }

        sendResponse(ctx, 200, "get data success !", data);
        await next();

    } catch (error) {

        console.log(error);
        sendError(ctx, "index user", "", 500);
    }
}

// Methods
const create = async (ctx) => {

    try {

        const province = await Location.create({
            name: ctx.request.body.province,
            type: Location.TYPE_PROVINCE
        });

        const district = await Location.create({
            name: ctx.request.body.district,
            type: Location.TYPE_DISTRICT,
            parent_id: province.id
        });

        const ward = await Location.create({
            name: ctx.request.body.ward,
            type: Location.TYPE_WARD,
            parent_id: district.id
        });

        ctx.request.body.location_id = ward.id;
        ctx.request.body.password = await bcrypt.hash(ctx.request.body.password, 10);

        const data = await User.create(ctx.request.body);

        ctx.session.data = {
            ...ctx.session.data,
            [User.name]: {
                ...ctx.session.data?.[User.name],
                list: {
                    ...ctx.session.data?.[User.name]?.list,
                    data
                },
                detail: {
                    data
                }
            }
        };

        sendResponse(ctx, 200, "create data success !", data);

    } catch (error) {
        sendError(ctx, "create user", "", 500, error.message);
    }
}

const exportUser = async (ctx) => {

    try {
        const data = await User.findAll({
            attributes: ['id', 'username', 'fullname', 'birthdate', 'address'],
            include: [{
                model: Location,
                attributes: ['parent_id', 'name', 'type'],
            }]
        });

        await exportExcel(ctx, data, 'users');

        sendResponse(ctx, 200, "export data success !");

    } catch (error) {
        sendError(ctx, "export user", "", 500, error.message);
    }
}

const detail = async (ctx) => {
    return detailUser(ctx, User, 'user');
}

const update = async (ctx) => {
    return updateUser(ctx, User, 'user');
}

const destroy = async (ctx) => {
    return destroyUser(ctx, User, 'user');
}

export {
    list,
    detail,
    create,
    update,
    destroy,
    exportUser
}