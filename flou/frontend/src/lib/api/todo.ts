import {TODO_API} from "$env/static/private";
import api from "$lib/api/index";
import {ENV} from "$lib/env";

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
    get: (fetch: typeof window.fetch) => _api().get(fetch, "/todo"),
    create: (fetch: typeof window.fetch, request: CreateToDoRequest) => _api().post(fetch, "/todo", request),
    update: (fetch: typeof window.fetch, request: UpdateToDoRequest) => _api().put(fetch, "/todo", request),
    delete: (fetch: typeof window.fetch, id: number) => _api().delete(fetch, `/todo/${id}`)
}

function _api() {
    const url = ENV.get(ENV.TODO_API);
    return api(url)
}
