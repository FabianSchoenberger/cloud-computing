import {TODO_API} from "$env/static/private";
import api from "$lib/api/index";

export interface ToDoResponse {
    id: number;
    name: string;
    done: boolean;
}

export interface CreateToDoRequest{
    name: string;
}

export interface UpdateToDoRequest{
    id: number;
    done: boolean;
}

export const todo = {
    get: (fetch: typeof window.fetch) => api(TODO_API).get(fetch, "/todo"),
    create: (fetch: typeof window.fetch, request: CreateToDoRequest) => api(TODO_API).post(fetch, "/todo", request),
    update: (fetch: typeof window.fetch, request: UpdateToDoRequest) => api(TODO_API).put(fetch, "/todo", request),
    delete: (fetch: typeof window.fetch, id: number) => api(TODO_API).delete(fetch, `/todo/${id}`)
}
