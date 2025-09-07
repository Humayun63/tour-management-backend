import { Server } from 'http';
import mongoose from 'mongoose';
import app from './app';

let server: Server;

const PORT = 5000;

const startServer = async () => {
    try {
        await mongoose.connect("mongodb+srv://noteapp:noteapp@cluster0.nucgrat.mongodb.net/ph-tour-management?retryWrites=true&w=majority&appName=Cluster0");

        console.log('DB is connected!');

        server = app.listen(PORT, () => {
            console.log(`App is listening to port ${PORT}`);
        })
    } catch(error) {

    }
};

startServer();