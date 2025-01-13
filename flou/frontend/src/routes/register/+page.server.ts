import {type Actions, fail, redirect} from "@sveltejs/kit";

import {account} from "$lib/api/account";
import {session} from "$lib/api/session";

export const load = async ({fetch}) => {
    const accountResponse = await account.get(fetch)
    if(accountResponse.ok) {
        redirect(301, "/")
    }
}

export const actions: Actions = {
    register: async ({fetch, request}) => {
        const data = await request.formData()
        const username = data.get("username") as string
        const password = data.get("password") as string

        console.log(`Registration attempt for ${username}`);

        const register = await account.create(fetch, {username, password})
        if(!register.ok) {
            return fail(register.status)
        }

        const login = await session.create(fetch, {username, password})
        if(!login.ok) {
            return fail(login.status)
        }

        redirect(301, "/")
    }
}
