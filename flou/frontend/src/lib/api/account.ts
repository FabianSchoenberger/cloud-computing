import {AUTH_API} from "$env/static/private";
import api from "$lib/api/index";
import {ENV} from "$lib/env";

export interface CreateAccountRequest {
    username: string,
    password: string
}

export interface AccountResponse {
    username: string
}

export const account = {
    get: (fetch: typeof window.fetch) => _api().get(fetch, "/account"),
    create: (fetch: typeof window.fetch, request: CreateAccountRequest) => _api().post(fetch, "/account", request)
}

function _api() {
    const url = ENV.get(ENV.AUTH_API);
    return api(url)
}
