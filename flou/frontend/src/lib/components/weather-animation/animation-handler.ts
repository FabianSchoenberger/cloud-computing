import rain from "$lib/components/weather-animation/rain";
import snow from "$lib/components/weather-animation/snow";

export const width = 5000
export const height = 5000

export interface AnimationHandler {
    start(context: CanvasRenderingContext2D): void
    stop(): void
}

// weather codes taken from www.weatherapi.com/docs
export const codesSunny = [
    1000,
]
export const codesCloudy = [
    1003,
]
export const codesSunnyCloudy = [
    1006,
]
export const codesRain = [
    1063, 1150, 1153, 1180, 1183, 1186, 1189, 1192, 1195, 1240, 1243, 1246,
]
export const codesThunder = [
    1273, 1276, 1279, 1282,
]
export const codesSleet = [
    1069, 1204, 1207, 1249, 1252
]
export const codesFreezingRain = [
    1072, 1168, 1198, 1201,
]
export const codesSnow = [
    1066, 1114, 1210, 1213, 1216, 1219, 1222, 1225, 1255, 1258,
]
export const codesHail = [
    1237, 1261, 1264
]

// decodes weather code to correct AnimationHandler
export function decode(code: number): AnimationHandler[] {
    const handlers = []

    if (
        codesRain.includes(code) ||
        codesThunder.includes(code) ||
        codesSleet.includes(code) ||
        codesFreezingRain.includes(code)
    ) handlers.push(rain(code))

    if (
        codesSnow.includes(code) ||
        codesHail.includes(code) ||
        codesSleet.includes(code)
    ) handlers.push(snow(code))

    return handlers
}
