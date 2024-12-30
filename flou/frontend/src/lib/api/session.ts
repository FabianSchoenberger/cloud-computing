import {AUTH_API} from "$env/static/private";
import api from "$lib/api/index";
import {ENV} from "$lib/env";

export interface CreateSessionRequest {
    username: string,
    password: string
}

export interface SessionResponse {
    username: string
}

export const session = {
    get: (fetch: typeof window.fetch) => _api().get(fetch, "/session"),
    create: (fetch: typeof window.fetch, request: CreateSessionRequest) => _api().post(fetch, "/session", request),
    delete: (fetch: typeof window.fetch) => _api().delete(fetch, "/session")
}

function _api() {
    const url = ENV.get(ENV.AUTH_API);
    return api(url)
}
