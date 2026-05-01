import api from "../axios.js"

export async function loginApi(username, password) {
    const res = await api.post('/admin/login/', { username, password })
    return res.data
}

export async function refreshApi() {
    const res = await api.post('/admin/refresh/')
    return res.data
}

export async function logoutApi() {
    const res = await api.post('/admin/logout/')
    return res.data
}