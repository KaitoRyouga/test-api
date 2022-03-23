import cron from 'node-cron';

export const cronJobUser = () => {
    cron.schedule('0 0 0 * * *', () => {
        console.log('running a task every day');
    });
}