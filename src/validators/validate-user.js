const createUser = async (ctx, next) => {

    ctx.verifyParams({
        username: {
            type: 'string',
            required: true,
            min: 6,
            max: 20
        },
        password: {
            type: 'string',
            required: true,
            min: 6,
            max: 20
        },
        fullname: {
            type: 'string',
            required: true,
            min: 6,
            max: 20
        },
        birthdate: {
            type: 'date',
            required: true
        },
        address: {
            type: 'string',
            required: true,
            min: 6,
            max: 20
        }
    });

    await next();
}

const updateUser = async (ctx, next) => {

    ctx.verifyParams({
        username: {
            type: 'string',
            required: true,
        },
        fullname: {
            type: 'string',
            required: true,
        },
        birthdate: {
            type: 'date',
            required: false
        },
        address: {
            type: 'string',
            required: false
        }
    });

    await next();
}

const login = async (ctx, next) => {

    ctx.verifyParams({
        username: {
            type: 'string',
            required: true
        },
        password: {
            type: 'string',
            required: true
        }
    });

    await next();
}

export {
    createUser,
    updateUser,
    login
}