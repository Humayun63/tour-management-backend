import { Server } from 'http';
import mongoose from 'mongoose';
import app from './app';
import { Debugger } from './app/utils/debugger';
import { envVars } from './app/config/env';

let server: Server;

const PORT = envVars.PORT || 5000;

const startServer = async () => {
    try {
        await mongoose.connect(envVars.DB_URL);

        Debugger.info('DB is connected!');

        server = app.listen(PORT, () => {
            Debugger.info(`App is listening to port ${PORT}`);
        })
    } catch(error) {
        Debugger.error(error);
    }
};

process.on('unhandledRejection', (error) => {
    Debugger.info('Unhandled Rejection Detected!..Shuting down the server...');
    Debugger.error(error);

    if(server){
        server.close(() => {
            process.exit(1);
        });
    }

    process.exit(1);
});


process.on('uncaughtException', (error) => {
    Debugger.info('Uncaught Exception detected!... server is shutting down..');
    Debugger.error(error);

    if(server){
        server.close(() => {
            process.exit(1);
        });
    }

    process.exit(1);
});

process.on('SIGTERM', () => {
    Debugger.info('Received SIGTERM!.. Shutting down...');

    if(server){
        server.close(() => {
            process.exit(1);
        })
    }

    process.exit(1);
});

process.on('SIGINT', () => {
    Debugger.info('Received SIGINT!.. Shutting down...');

    if(server){
        server.close(() => {
            process.exit(1);
        })
    }

    process.exit(1);
})

startServer();