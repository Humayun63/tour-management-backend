import { envVars } from "../config/env";
import { IAuthProvider, IUser, Providers, Role } from "../modules/user/user.interface";
import { User } from "../modules/user/user.model";
import { Debugger } from "./debugger"
import { hashedPassword } from "./hashedPassword";

export const seedSuperAdmin = async () => {
    try {
        const isSuperAdminExist = await User.findOne({email: envVars.SUPER_ADMIN_EMAIL});
        if(isSuperAdminExist){
            Debugger.info('Super Admin Exist');
            return;
        }

        Debugger.info('Trying to create Super Admin');
        const authProvider: IAuthProvider = {
            provider: Providers.CREDENTIALS,
            providerId: envVars.SUPER_ADMIN_EMAIL
        };

        const password = await hashedPassword(envVars.SUPER_ADMIN_PASSWORD) as string;

        const payload: IUser = {
            name: 'Super Admin',
            role: Role.SUPER_ADMIN,
            email: envVars.SUPER_ADMIN_EMAIL,
            password: password,
            auths: [authProvider],
            isVerified: true,
        };

        await User.create(payload);
        Debugger.info('Super Admin Created Successfully');
    } catch(error){
        Debugger.error(error);
    }
};