import {applyAction, deserialize} from "$app/forms";

export async function action(uri: string, data: Record<string, string | Blob> = {}) {
    const formData = new FormData()
    for(const key of Object.keys(data)) {
        formData.append(key, data[key])
    }

    const response = await fetch(uri, {method: "POST", body: formData})
    const result = deserialize(await response.text())

    await applyAction(result)
}
