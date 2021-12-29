import { ENDPOINTS } from "src/utils/endpoints";
import { getLocalStorage } from "src/utils/common";
import API from "./API";

interface LoginParams {
    email: string;
    password: string;
}
class AuthService extends API{
    constructor(){
        super({url : "auth"})
    }
    login = ({ email, password }: LoginParams) => this.post(ENDPOINTS.LOGIN, {
        email,
        password
    }).then(res => res);

    logout = async () => this.post(ENDPOINTS.LOGOUT);

    register = () => this.post(ENDPOINTS.REGISTER).then(res => res);
    
    verify = (access_token: string) => this.post(ENDPOINTS.VERIFY, { access_token }).then(res => res);

    me = () => JSON.parse(getLocalStorage("user") || '{}') || this.post(ENDPOINTS.ME).then(res => res);

    updateMe = (data : any) => this.put(ENDPOINTS.ME, data).then(res => res.data);
    
    passwordReset = (data : any) => this.post(ENDPOINTS.PASSWORD_RESET, data).then(res => res);
};

export default new AuthService;