import api from "$lib/api/index";
import {ENV} from "$lib/env";

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

const API = "http://api.weatherapi.com/v1"

export const weather = {
    get: (fetch: typeof window.fetch, latitude: number, longitude: number) => {
        const parameters = new URLSearchParams({
            key: ENV.get(ENV.WEATHER_API_KEY),
            q: `${latitude},${longitude}`
        })
        return api(API).get(fetch, "/current.json", parameters)
    }
}
