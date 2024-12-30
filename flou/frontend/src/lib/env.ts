export const ENV = {
    AUTH_API: "AUTH_API",
    TODO_API: "TODO_API",
    WEATHER_API_KEY: "WEATHER_API_KEY",
    CALENDAR_ICS: "CALENDAR_ICS",
    get: (key: string): string => {
        return process.env[key]!
    }
}
