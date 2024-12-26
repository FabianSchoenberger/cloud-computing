import type {Cookies} from "@sveltejs/kit";
import {type Cookie, parse} from "set-cookie-parser";

export const handleFetch = async ({fetch, request, event}) => {
    const cookie = event.request.headers.get("Cookie")
    if(cookie) {
        request.headers.set("Cookie", cookie)
    }
    const response = await fetch(request)
    setCookies(event.cookies, response)
    return response
}

const setCookies = (cookies: Cookies, response: Response) => {
    const headers = response.headers.getSetCookie()
    for (const cookie of parse(headers)) {
        set(cookies, cookie)
    }
}
const set = (cookies: Cookies, cookie: Cookie) => {
    cookies.set(cookie.name, cookie.value, {
        domain: cookie.domain,
        path: cookie.path || "/",
        maxAge: cookie.maxAge,
        httpOnly: cookie.httpOnly,
        secure: cookie.secure,
        sameSite: cookie.sameSite as ("strict" | "lax" | "none" | undefined)
    })
}
