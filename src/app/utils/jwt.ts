import jwt, { JwtPayload, SignOptions } from 'jsonwebtoken';
import { Debugger } from './debugger';

export const generateToken = async (payload: JwtPayload, secret: string, expiresIn: string) =>{
    try {
        const token = await jwt.sign(payload, secret, {
            expiresIn: expiresIn
        } as SignOptions);

        return token;
    } catch(error){
        Debugger.error(error);
    }
};

export const verifyToken = (token: string, secret: string) =>{
    const verifiedToken = jwt.verify(token, secret);
    return verifiedToken;
}