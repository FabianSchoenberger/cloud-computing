import {type Readable, derived} from "svelte/store";

export function error(message?: string): never {
    throw new Error(message);
}

// for some godforsaken reason javascript modulo can return negative numbers
export function mod(n: number, m: number): number {
    return ((n % m) + m) % m
}

export function debounce<T>(store: Readable<T>, debounce: number): Readable<T> {
    let timeout: NodeJS.Timeout | undefined
    return derived(store, (it, set) => {
        clearTimeout(timeout)
        timeout = setTimeout(() => set(it), debounce)
    })
}
