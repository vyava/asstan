import Axios from "axios";
import { ENDPOINTS } from "src/utils/endpoints";
import API from "src/services/API";

export class UserService extends API {
  constructor(){
    super({url : "user"})
}
  static getUser = (id: string) =>
    Axios.get(ENDPOINTS.BAYILER, { params: { id } });
}
