import {Howl, Howler} from "howler";
import type {Readable, Writable} from "svelte/store";
import {get, readonly, writable} from "svelte/store";

import type {Audio} from "$lib/api/audio";

const fadeDuration = 2000

type Event = "load" | "play" | "stop" | "end" | "pause" | "unpause" | "volume" | "mute" | "seek"
type Listener = (arg?: unknown) => void

/*
 * custom howler.js wrapper
 */
class Roar {
    private _howl?: Howl

    private _audio: Writable<Audio | undefined> = writable()
    private _playing: Writable<boolean> = writable(false)

    private _duration: Writable<number | undefined> = writable()
    private _seek: Writable<number | undefined> = writable()

    private _volume: Writable<number> = writable(Howler.volume())
    private _mute: Writable<boolean> = writable(false)

    get audio(): Readable<Audio | undefined> {
        return readonly(this._audio)
    }

    get playing(): Readable<boolean> {
        return readonly(this._playing)
    }

    get volume(): Readable<number | undefined> {
        return readonly(this._volume)
    }

    set volume(value: number) {
        Howler.volume(value)
        this._volume.set(value)
        this.fire("volume", value)
    }

    get mute(): Readable<boolean> {
        return readonly(this._mute)
    }

    set mute(value: boolean) {
        Howler.mute(value)
        this._mute.set(value)
        this.fire("mute", value)
    }

    get duration(): Readable<number | undefined> {
        return readonly(this._duration)
    }

    get seek(): Readable<number | undefined> {
        return readonly(this._seek)
    }

    set seek(value: number) {
        if (this._howl === undefined)
            return

        this._howl.seek(value / 1000)
        this._seek.set(value)
        this.fire("seek", value)
    }

    preload(audio: Audio) {
        new Howl({src: audio.src})
    }

    load(audio: Audio) {
        if (this._howl !== undefined)
            this.stop()

        this._howl = new Howl({src: audio.src})
        this._audio.set(audio)

        this._howl.once('load', () => {
            if (this._howl === undefined)
                throw new Error()

            this._duration.set(this._howl.duration() * 1000)
            this._seek.set(0)
            this.fire("load")
        })
    }

    play(audio: Audio) {
        if (this._howl !== undefined)
            this.stop()

        this._howl = new Howl({src: audio.src})
        this._audio.set(audio)

        this._howl.once('play', () => {
            if (this._howl === undefined)
                throw new Error()

            this._playing.set(true)
            this._duration.set(this._howl.duration() * 1000)
            this.syncSeek()
            this.fadein()
            this.fire("play")
        })
        this._howl.on("end", () => {
            this._playing.set(false)
            this.fire("end")
        })

        this._howl.on('play', () => {
            this.syncSeek()
            this.setFadeout()
        })
        this._howl.on('seek', () => {
            this.syncSeek()
            this.setFadeout()
        })
        this._howl.on('pause', () => {
            this.unsyncSeek()
            this.resetFadeout()
        })

        this._howl.play()
    }

    pause() {
        if (this._howl === undefined || !get(this.playing))
            return

        this._howl.pause()
        this._playing.set(false)
        this.fire("pause")
    }

    unpause() {
        if (this._howl === undefined || get(this.playing))
            return

        this._howl.play()
        this._playing.set(true)
        this.fire("unpause")
    }

    stop() {
        if (this._howl === undefined)
            return

        this._howl.off()
        this._howl.stop()
        this.fire("stop")

        this.reset()
    }

    private _seekTimeout?: NodeJS.Timeout

    private syncSeek() {
        if (this._howl === undefined)
            return

        this._seek.set(this._howl.seek() * 1000)
        clearTimeout(this._seekTimeout)
        this._seekTimeout = setInterval(
            () => this._seek.update(it => (it ?? 0) + 1000),
            1000
        )
    }

    private unsyncSeek() {
        clearTimeout(this._seekTimeout)
    }

    private resetSeek() {
        this.unsyncSeek()
        this._seek.set(undefined)
    }

    private fadein() {
        if (this._howl === undefined)
            return

        this._howl.fade(0, 1, fadeDuration)
    }

    private _fadeoutTimeout?: NodeJS.Timeout

    private setFadeout() {
        if (this._howl === undefined)
            return

        this.resetFadeout()

        const duration = this._howl.duration() * 1000
        const seek = this._howl.seek() * 1000
        this._fadeoutTimeout = setTimeout(
            () => {
                this._howl?.fade(1, 0, fadeDuration);
            },
            (duration - seek) - fadeDuration
        );
    }

    private resetFadeout() {
        if (this._fadeoutTimeout === undefined)
            return

        clearTimeout(this._fadeoutTimeout)
        this._fadeoutTimeout = undefined
    }

    private reset() {
        this._howl = undefined
        this._audio.set(undefined)
        this._playing.set(false)
        this._duration.set(undefined)
        this.resetSeek()
        this.resetFadeout()
    }

    private _on = new Map<Event, Listener[]>()
    private _once = new Map<Event, Listener[]>()

    on(event: Event, listener: Listener) {
        const listeners = this._on.get(event)
        if (listeners !== undefined) {
            listeners.push(listener)
        } else {
            this._on.set(event, [listener])
        }
    }

    once(event: Event, listener: Listener) {
        const listeners = this._on.get(event)
        if (listeners !== undefined) {
            listeners.push(listener)
        } else {
            this._once.set(event, [listener])
        }
    }

    private fire(event: Event, arg?: unknown) {
        for (const listener of this._on.get(event) ?? []) {
            listener(arg)
        }

        for (const listener of this._once.get(event) ?? []) {
            listener(arg)
        }
        this._once.delete(event)
    }
}

export const roar = () => new Roar()
