import { UserService } from "src/services/user";

export const userFetcher = async (id : string) => UserService.getUser(id)