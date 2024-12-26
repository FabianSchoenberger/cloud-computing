import {WEATHER_API, WEATHER_API_KEY} from "$env/static/private";
import api from "$lib/api/index";


export interface WeatherResponse {
    location: {
        name: string
        region: string
        country: string
        lat: number
        lon: number
    }
    current: {
        temp_c: number
        temp_f: number
        is_day: number
        condition: {
            code: number
            text: string
            icon: string
        }
        wind_mph: number
        wind_kph: number
        wind_degree: number
        humidity: number
    }
}

export const weather = {
    get: (fetch: typeof window.fetch, latitude: number, longitude: number) => {
        const parameters = new URLSearchParams({
            key: WEATHER_API_KEY,
            q: `${latitude},${longitude}`
        })
        return api(WEATHER_API).get(fetch, "/current.json", parameters)
    }
}
