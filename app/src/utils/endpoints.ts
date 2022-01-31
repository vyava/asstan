import { API_URL } from "src/config"

export const ENDPOINTS = {
    BAYILER : `${API_URL}/bayiler`,
    BAYI : `${API_URL}/bayi`,
    TOWNS : `${API_URL}/towns`,
    LOGIN : `${API_URL}/auth/login`,
    LOGOUT : `${API_URL}/auth/logout`,
    REGISTER : `${API_URL}/auth/register`,
    PASSWORD_RESET : `${API_URL}/auth/password-reset`,
    VERIFY : `${API_URL}/auth/verify`,
    ME : `${API_URL}/user/me`,
}