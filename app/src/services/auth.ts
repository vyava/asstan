import { ENDPOINTS } from "src/utils/endpoints";
import { getLocalStorage } from "src/utils/common";
import {http} from "./API";

interface LoginParams {
    email: string;
    password: string;
}
class AuthService {
    login = ({ email, password }: LoginParams) => http.post(ENDPOINTS.LOGIN, { email, password });

    logout = async () => http.post(ENDPOINTS.LOGOUT);

    register = () => http.post(ENDPOINTS.REGISTER).then(res => res);
    
    verify = (access_token: string) => http.post(ENDPOINTS.VERIFY, { access_token }).then(res => res);

    me = () => JSON.parse(getLocalStorage("user") || '{}') || http.post(ENDPOINTS.ME).then(res => res);

    updateMe = (data : any) => http.put(ENDPOINTS.ME, data).then(res => res);
    
    passwordReset = (data : any) => http.post(ENDPOINTS.PASSWORD_RESET, data).then(res => res);
};

export default new AuthService;