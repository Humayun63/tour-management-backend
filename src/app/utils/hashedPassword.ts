import bcryptjs from 'bcryptjs';
import { envVars } from '../config/env';
import { Debugger } from './debugger';

export const hashedPassword = async (password: string) => {
    try {
        const hashedPassword = await bcryptjs.hash(password, Number(envVars.BCRYPT_SALT_ROUNDS));
        return hashedPassword;
    } catch(error){
        Debugger.error(error);
    }
}