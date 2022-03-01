import Axios from "axios";
import { ENDPOINTS } from "src/utils/endpoints";
import { http } from "src/services/API";

export class UserService {
  static getUser = (id: string) =>
    http.get(ENDPOINTS.BAYILER, { params: { id } });
}
