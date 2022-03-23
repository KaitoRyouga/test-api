const routeUser = (router) => {

    router
        .get("/", function (ctx, next) {
            ctx.body = "test123";
        })
}

export default routeUser;