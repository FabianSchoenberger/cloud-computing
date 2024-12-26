import {
    type AnimationHandler,
    codesHail,
    codesSleet,
    codesSnow,
    height,
    width
} from "$lib/components/weather-animation/animation-handler";
import {error} from "$lib/util";

const frequency = 20 // snowflakes/s
const speed = 500 // px/s

const weight = 10

const colorSnow = "#fff"
const colorHail = "#fff"
const colorSleet = "#fff"

interface Snowflake {
    x: number
    y: number
}

export default function snow(code: number): AnimationHandler {
    let _snowflakes: Snowflake[] = []

    let _animationHandle: number | undefined
    let _frequencyInterval: NodeJS.Timeout | undefined
    let _speedInterval: NodeJS.Timeout | undefined

    const color = _getColor()

    function _getColor(): string {
        if (codesSnow.includes(code)) {
            return colorSnow
        } else if (codesHail.includes(code)) {
            return colorHail
        } else if (codesSleet.includes(code)) {
            return colorSleet
        }
        error("no color for given code")
    }

    function _draw(context: CanvasRenderingContext2D) {
        context.clearRect(0, 0, width, height)
        context.strokeStyle = color

        for (const {x, y} of _snowflakes) {
            context.beginPath()
            context.moveTo(x, y)
            context.lineTo(x, y + weight / _aspectRatio())
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

    // assumes animation is the same size as window
    function _aspectRatio() {
        return window.innerHeight / window.innerWidth
    }

    function start(context: CanvasRenderingContext2D) {
        stop()

        _frequencyInterval = setInterval(() => {
            const x = Math.random() * width
            _snowflakes.push({x, y: -weight})
        }, 1000 / frequency)

        _speedInterval = setInterval(() => {
            _snowflakes.forEach(it => it.y += (speed / 100) * _px())
            _snowflakes = _snowflakes.filter(it => it.y <= height)
        }, 10)

        context.lineWidth = weight
        _animationHandle = requestAnimationFrame(() => {
            _draw(context)
        })
    }

    function stop() {
        _snowflakes = []

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
