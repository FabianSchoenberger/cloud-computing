import {
    type AnimationHandler, codesFreezingRain,
    codesRain, codesSleet,
    codesThunder,
    height,
    width
} from "$lib/components/weather-animation/animation-handler";
import {error} from "$lib/util";

const frequency = 50 // raindrops/s
const speed = 2000 // px/s

const length = 50 // px
const weight = 3

const colorRain = "#00008b"
const colorThunder = "#00008b"
const colorSleet = "#00008b"
const colorFreezingRain = "#fff"

interface Raindrop {
    x: number
    y: number
}

export default function rain(code: number): AnimationHandler {
    let _raindrops: Raindrop[] = []

    let _animationHandle: number | undefined
    let _frequencyInterval: NodeJS.Timeout | undefined
    let _speedInterval: NodeJS.Timeout | undefined

    const color = _getColor()

    function _getColor(): string {
        if (codesRain.includes(code)) {
            return colorRain
        } else if (codesThunder.includes(code)) {
            return colorThunder
        } else if (codesSleet.includes(code)) {
            return colorSleet
        } else if (codesFreezingRain.includes(code)) {
            return colorFreezingRain
        }
        error()
    }

    function _draw(context: CanvasRenderingContext2D) {
        context.clearRect(0, 0, width, height)
        context.strokeStyle = color

        for (const {x, y} of _raindrops) {
            context.beginPath()
            context.moveTo(x, y)
            context.lineTo(x, y + length * _px())
            context.stroke()
        }

        _animationHandle = requestAnimationFrame(() => {
            _draw(context)
        })
    }

    // returns how many units equals 1 px
    // assumes animation is the same size as window
    function _px() {
        return height / window.innerHeight
    }

    function start(context: CanvasRenderingContext2D) {
        stop()

        _frequencyInterval = setInterval(() => {
            const x = Math.random() * width
            _raindrops.push({x, y: -length})
        }, 1000 / frequency)

        _speedInterval = setInterval(() => {
            _raindrops.forEach(it => it.y += (speed / 100) * _px())
            _raindrops = _raindrops.filter(it => it.y <= height)
        }, 10)

        context.lineWidth = weight
        _animationHandle = requestAnimationFrame(() => {
            _draw(context)
        })
    }

    function stop() {
        _raindrops = []

        if (_animationHandle !== undefined)
            cancelAnimationFrame(_animationHandle)

        if (_frequencyInterval !== undefined)
            clearInterval(_frequencyInterval)

        if (_speedInterval !== undefined)
            clearInterval(_speedInterval)
    }

    return {
        start, stop
    }
}
