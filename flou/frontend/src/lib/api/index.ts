export default function (baseUrl: string) {
    return {
        get: (fetch: typeof window.fetch, uri: string, parameters?: URLSearchParams) => {
            return fetch(`${baseUrl}${uri}?${parameters ?? ""}`)
        },
        post: async (fetch: typeof window.fetch, uri: string, body?: object, parameters?: URLSearchParams) => {
            return fetch(`${baseUrl}${uri}?${parameters ?? ""}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: body ? JSON.stringify(body) : undefined
            })
        },
        put: async (fetch: typeof window.fetch, uri: string, body?: object, parameters?: URLSearchParams) => {
            return fetch(`${baseUrl}${uri}?${parameters ?? ""}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: body ? JSON.stringify(body) : undefined
            })
        },
        delete: async (fetch: typeof window.fetch, uri: string, parameters?: URLSearchParams) => {
            return fetch(`${baseUrl}${uri}?${parameters ?? ""}`, {
                method: "DELETE"
            })
        }
    }
}
