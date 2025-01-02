import 'reflect-metadata';
import { startApp } from './app';
import env from './config';
import connectDB from './config/db.config';
import { registerDependencies } from './container';

(async () => {
    const conn = await connectDB();

    registerDependencies();

    const app = startApp();
    const server = app.listen(env.PORT, () => {
        console.log(`Server running on port ${env.PORT}`);
    });

    process.on('SIGTERM', async () => {
        server.close(async () => {
            await conn.connection.close();
            console.log('Process terminated!');
            process.exit(0);
        });
    });
})();
