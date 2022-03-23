import fs from 'fs';

export const routes = (router) => {
    fs.readdirSync('./src/routes/').forEach(file => {
        const regex = /^router-.*\.js$/;
        if (regex.test(file)) {
            import(`./${file}`).then(route => {
                route.default(router);
            });
        }
    });
}