import {getContext, hasContext, setContext} from "svelte";
import {type Writable, writable} from "svelte/store";

import type {AccountResponse} from "$lib/api/account";
import type {ToDoResponse} from "$lib/api/todo";
import type {CalendarEntry} from "$lib/api/calender";
import type {WeatherResponse} from "$lib/api/weather";
import {roar} from "$lib/roar";

const use = <T>(key: string | object, value?: () => T): T => {
    if (!hasContext(key)) {
        setContext(key, value?.())
    }
    return getContext(key)
}
const useWritable = <T>(key: string | object, value?: () => T) => use<Writable<T>>(key, () => writable<T>(value?.()))

export const ACCOUNT = {}
export const useAccount = () => useWritable<AccountResponse | undefined>(ACCOUNT)

export const TODOS = {}
export const useToDos = () => useWritable<ToDoResponse[] | undefined>(TODOS)

export const CALENDAR = {}
export const useCalendar = () => useWritable<CalendarEntry[] | undefined>(CALENDAR)

export const WEATHER = {}
export const useWeather = () => useWritable<WeatherResponse | undefined>(WEATHER)

export interface OverlayOptions {
    visible: boolean,
    x: number,
    y: number,
    horizontalAlignment: "left" | "center" | "right",
    verticalAlignment: "top" | "center" | "bottom"
}

const DEFAULT_OVERLAY_OPTIONS: OverlayOptions = {
    visible: false,
    x: 0,
    y: 0,
    horizontalAlignment: "right",
    verticalAlignment: "bottom"
}

export const USER_OVERLAY = {}
export const useOverlayOptions = (key: string | object) => useWritable<OverlayOptions>(key, () => DEFAULT_OVERLAY_OPTIONS)

export const CURRENT_BG = {}
export const useCurrentBG = () => useWritable(CURRENT_BG, () => 1);

export const CURRENT_COLOR = {}
export const useCurrentColor = () => useWritable(CURRENT_COLOR, () => '#00a7d1');

export const COLOR_CHANGE = {}
export const useColorChange = () => useWritable(COLOR_CHANGE, () => false);

export const DARK_MODE = {}
export const useDarkMode = () => useWritable(DARK_MODE, () => false);
export const ROAR = {}
export const POMODOR_ROAR = {}

export const useRoar = () => use(ROAR, () => roar())
export const usePomodorRoar = () => use(POMODOR_ROAR, () => roar())
