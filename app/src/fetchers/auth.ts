import { IUser } from "src/interfaces/user.interface";
import AuthService from "src/services/auth";

export const loginFetcher = async ({ email, password }: any) => {
    return AuthService.login({ email, password });
};

export const logoutFetcher = async () => {
    await AuthService.logout();
};

export const meFetcher = async () : Promise<IUser> => {
    return AuthService.me();
};

export const updateMeFetcher = async (data : any) : Promise<IUser> => {
    console.log("updateMeFetcher called with data : "+ data)
    return AuthService.updateMe(data);
};

export const verifyFetcher = async (access_token : string) => {
    return AuthService.verify(access_token);
};

export const resetFetcher = async (data : any) => {
    console.log("RESETFETCHER")
    console.log(data);
    
    return AuthService.passwordReset(data);
}