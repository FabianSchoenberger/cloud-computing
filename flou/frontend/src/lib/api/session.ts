import {AUTH_API} from "$env/static/private";
import api from "$lib/api/index";

export interface CreateSessionRequest {
    username: string,
    password: string
}

export interface SessionResponse {
    username: string
}

export const session = {
    get: (fetch: typeof window.fetch) => api(AUTH_API).get(fetch, "/session"),
    create: (fetch: typeof window.fetch, request: CreateSessionRequest) => api(AUTH_API).post(fetch, "/session", request),
    delete: (fetch: typeof window.fetch) => api(AUTH_API).delete(fetch, "/session")
}
