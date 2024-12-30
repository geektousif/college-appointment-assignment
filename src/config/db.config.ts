import mongoose from 'mongoose';
import envConfig from '.';
import logger from './logger.config';

const connectDB = async () => {
    try {
        const connection = await mongoose.connect(envConfig.DB_URL);
        logger.info(`Database connected with ${connection.connection.host}`);

        connection.connection.on('disconnected', () => {
            logger.info('Database disconnected');
        });

        process.on('SIGINT', async () => {
            await connection.connection.close();
            process.exit(0);
        });

        return connection;
    } catch (error) {
        logger.error('Error connecting to database', error);
        process.exit(1);
    }
};

export default connectDB;
