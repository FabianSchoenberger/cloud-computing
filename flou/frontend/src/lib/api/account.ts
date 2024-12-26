import {AUTH_API} from "$env/static/private";
import api from "$lib/api/index";

export interface CreateAccountRequest {
    username: string,
    password: string
}

export interface AccountResponse {
    username: string
}

export const account = {
    get: (fetch: typeof window.fetch) => api(AUTH_API).get(fetch, "/account"),
    create: (fetch: typeof window.fetch, request: CreateAccountRequest) => api(AUTH_API).post(fetch, "/account", request)
}
