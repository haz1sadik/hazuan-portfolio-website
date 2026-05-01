import { loginApi, logoutApi, refreshApi } from "../api/auth.js";

export async function loginAction(username, password) {
    return loginApi(username, password);
}

export async function refreshAction() {
    return refreshApi();
}

export async function logoutAction() {
    return logoutApi();
}
