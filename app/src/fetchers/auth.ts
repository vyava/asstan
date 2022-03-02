import { IUser } from "src/interfaces/user.interface";
import AuthService from "src/services/auth";

export const loginFetcher = ({ email, password }: any) => AuthService.login({ email, password });

export const logoutFetcher = () => AuthService.logout();

export const meFetcher = () => AuthService.me();

export const updateMeFetcher = (data : any) => AuthService.updateMe(data);

export const verifyFetcher = (access_token : string) => AuthService.verify(access_token);

export const resetFetcher = (data : any) => AuthService.passwordReset(data);