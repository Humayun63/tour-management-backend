import { Server } from 'http';
import mongoose from 'mongoose';
import app from './app';
import { Debugger } from './app/utils/debugger';

let server: Server;

const PORT = 5000;

const startServer = async () => {
    try {
        await mongoose.connect("mongodb+srv://noteapp:noteapp@cluster0.nucgrat.mongodb.net/ph-tour-management?retryWrites=true&w=majority&appName=Cluster0");

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