import { Server } from 'http';
import mongoose from 'mongoose';
import app from './app';

let server: Server;

const PORT = 5000;

const startServer = async () => {
    try {
        await mongoose.connect("mongodb+srv://noteapp:noteapp@cluster0.nucgrat.mongodb.net/ph-tour-management?retryWrites=true&w=majority&appName=Cluster0");

        console.info('DB is connected!');

        server = app.listen(PORT, () => {
            console.info(`App is listening to port ${PORT}`);
        })
    } catch(error) {
        console.error(error);
    }
};

process.on('unhandledRejection', (error) => {
    console.info('Unhandled Rejection Detected!..Shuting down the server...', error);

    if(server){
        server.close(() => {
            process.exit(1);
        });
    }

    process.exit(1);
});


process.on('uncaughtException', (error) => {
    console.info('Uncaught Exception detected!... server is shutting down..', error);

    if(server){
        server.close(() => {
            process.exit(1);
        });
    }

    process.exit(1);
});

process.on('SIGTERM', () => {
    console.info('Received SIGTERM!.. Shutting down...');

    if(server){
        server.close(() => {
            process.exit(1);
        })
    }

    process.exit(1);
});

process.on('SIGINT', () => {
    console.info('Received SIGINT!.. Shutting down...');

    if(server){
        server.close(() => {
            process.exit(1);
        })
    }

    process.exit(1);
})

startServer();