import dotenv from 'dotenv';
import { Debugger } from '../utils/debugger';

dotenv.config();

interface IEnvConfig {
    PORT: string
    DB_URL: string
    NODE_ENV: string
}

const loadVariables = (): IEnvConfig => {
    const requiredEnvVars: string[] = ['PORT', 'DB_URL', 'NODE_ENV']

    requiredEnvVars.forEach(key => {
        if(!process.env[key]){
            Debugger.error(`Missing required variable ${key}`);
            throw new Error(`Missing required variable ${key}`);
        }
    })

    return {
        PORT: process.env.PORT as string,
        DB_URL: process.env.DB_URL!,
        NODE_ENV: process.env.NODE_ENV!
    }
}

export const envVars = loadVariables();
