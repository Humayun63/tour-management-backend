import dotenv from 'dotenv';
import { Debugger } from '../utils/debugger';

dotenv.config();

interface IEnvConfig {
    PORT: string
    DB_URL: string
    NODE_ENV: string
    JWT_ACCESS_SECRET: string
    JWT_ACCESS_EXPIRES: string
    BCRYPT_SALT_ROUNDS: string
}

const loadVariables = (): IEnvConfig => {
    const requiredEnvVars: string[] = ['PORT', 'DB_URL', 'NODE_ENV', 'JWT_ACCESS_SECRET', 'JWT_ACCESS_EXPIRES', 'BCRYPT_SALT_ROUNDS']

    requiredEnvVars.forEach(key => {
        if(!process.env[key]){
            Debugger.error(`Missing required variable ${key}`);
            throw new Error(`Missing required variable ${key}`);
        }
    })

    return {
        PORT: process.env.PORT as string,
        DB_URL: process.env.DB_URL as string,
        NODE_ENV: process.env.NODE_ENV as string,
        JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET as string,
        JWT_ACCESS_EXPIRES: process.env.JWT_ACCESS_EXPIRES as string,
        BCRYPT_SALT_ROUNDS: process.env.BCRYPT_SALT_ROUNDS as string
    }
}

export const envVars = loadVariables();
