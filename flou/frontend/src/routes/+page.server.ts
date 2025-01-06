import {type Actions, fail, redirect} from "@sveltejs/kit";

import {account, type AccountResponse} from "$lib/api/account";
import {type CalendarEntry, calendar} from "$lib/api/calender";
import {session} from "$lib/api/session";
import {todo, type ToDoResponse} from "$lib/api/todo";
import {weather, type WeatherResponse} from "$lib/api/weather";
import {ENV} from "$lib/env";

export interface Load {
    account: AccountResponse,
    todos: ToDoResponse[],
    calendar: CalendarEntry[]
}

export const load = async ({fetch}): Promise<Load> => {
    return {
        account: await getAccount(fetch),
        todos: await getToDos(fetch),
        calendar: await getCalendar(fetch)
    }
}

export const actions: Actions = {
    logout: async ({fetch}) => {
        const logout = await session.delete(fetch)
        if (!logout.ok) {
            fail(logout.status)
        }

        redirect(301, "/login")
    },
    "sync-weather": async ({request, fetch}) => {
        const data = await request.formData()
        const latitude = Number.parseInt(data.get("latitude") as string)
        const longitude = Number.parseInt(data.get("longitude") as string)

        return {
            weather: await getWeather(fetch, latitude, longitude)
        }
    },
    createTodo: async ({request, fetch}) => {
        const data = await request.formData()
        const name: string = data.get("name") as string;

        return {
            todoEvent: {
                event: "POST",
                todo: await createToDo(fetch, name)
            }
        }
    },
    updateTodo: async ({request, fetch}) => {
        const data = await request.formData()
        const id: number = Number(data.get("id"));
        const doneAsString: string = data.get("done") as string;

        const done: boolean = convertStringToBoolean(doneAsString);


        return {
            todoEvent: {
                event: "PUT",
                todo: await updateTodo(fetch, id, done)
            }
        }
    },
    deleteTodo: async ({request, fetch}) => {
        const data = await request.formData()
        const id: number = Number(data.get("id"));

        return {
            todoEvent: {
                event: "DELETE",
                todo: await deleteToDo(fetch, id)
            }
        }
    }
}

async function getAccount(fetch: typeof window.fetch): Promise<AccountResponse> {
    const currentAccount = await account.get(fetch)
    switch (currentAccount.status) {
        case 401:
            redirect(301, "/login")
    }

    return await currentAccount.json()
}

async function getToDos(fetch: typeof window.fetch): Promise<ToDoResponse[]> {
    const todos = await todo.get(fetch)
    switch (todos.status) {
        case 401:
            redirect(301, "/login")
    }

    return await todos.json()
}

async function getCalendar(fetch: typeof window.fetch): Promise<CalendarEntry[]> {
    return calendar.get(fetch, ENV.get(ENV.CALENDAR_ICS))
}

async function getWeather(fetch: typeof window.fetch, latitude: number, longitude: number): Promise<WeatherResponse> {
    const current = await weather.get(fetch, latitude, longitude)

    return await current.json()
}

async function createToDo(fetch: typeof window.fetch, name: string): Promise<ToDoResponse> {
    const response = await todo.create(fetch, {name});

    switch (response.status) {
        case 401:
            redirect(301, "/login")
    }

    return await response.json()
}

async function updateTodo(fetch: typeof window.fetch, id: number, done: boolean): Promise<ToDoResponse> {
    const response = await todo.update(fetch, {id: id, done: done});

    switch (response.status) {
        case 401:
            redirect(301, "/login")
    }

    return await response.json()
}

async function deleteToDo(fetch: typeof window.fetch, id: number): Promise<ToDoResponse> {
    const response = await todo.delete(fetch, id);

    switch (response.status) {
        case 401:
            redirect(301, "/login")
    }

    return await response.json()
}

function convertStringToBoolean(str: string): boolean {
    return str.toLowerCase() === "true";
}
