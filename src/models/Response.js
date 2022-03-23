const sendResponse = (ctx, status, message, data) => {

    ctx.status = status;
    ctx.body = {
        message: message,
        data: data,
        total: data.length
    }
}

const sendError = (ctx, where, field = null, status, message = null) => {

    ctx.status = status;
    ctx.body = {
        type: where,
        field: field,
    };

    switch (status) {

        case 400:
            ctx.body = {
                ...ctx.body,
                message: message || `${field} is required`
            }
            break;

        case 401:
            ctx.body = {
                ...ctx.body,
                message: message || `${field} is not valid`
            }
            break;

        case 403:
            ctx.body = {
                ...ctx.body,
                message: message || `authentication failed`
            }
            break;

        case 404:
            ctx.body = {
                ...ctx.body,
                message: message || `${field} is not found`
            }
            break;

        case 500:
            ctx.body = {
                ...ctx.body,
                message: message || `${field} is not found`
            }
            break;

        default:
            ctx.body = {
                ...ctx.body,
                message: message || `${field} is not found`
            }
            break;
    }
}

export {
    sendResponse,
    sendError
}