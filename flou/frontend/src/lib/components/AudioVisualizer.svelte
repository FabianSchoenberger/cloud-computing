<script lang="ts">
    import {useRoar} from "$lib/contexts";

    export let count = 64
    export let maxHeight = 1
    export let minHeight = 0
    export let margin = 0
    export let color = "#000"

    let canvas: HTMLCanvasElement | null = null
    let ctx: CanvasRenderingContext2D | null = null

    $: {
        if(canvas !== null) {
            ctx = canvas.getContext('2d')

            if(ctx !== null) {
                ctx.fillStyle = color
            }

            data = new Uint8Array(count)
            draw()
        }
    }

    const roar = useRoar()

    let analyser: AnalyserNode
    let data: Uint8Array

    roar.once("play", () => {
        initialise()
    })

    function initialise() {
        analyser = Howler.ctx.createAnalyser()
        analyser.fftSize = count * 2
        Howler.masterGain.connect(analyser)

        animate()
    }

    function animate() {
        analyser.getByteFrequencyData(data)
        draw();

        requestAnimationFrame(animate)
    }

    function draw() {
        if(canvas !== null && ctx !== null) {
            ctx.clearRect(0, 0, canvas.width, canvas.height)

            for (let i = 0; i < data.length; i++) {
                const height = Math.max((maxHeight * canvas.height) * (data[i] / 255), minHeight)
                const width = canvas.width / data.length - 2 * margin

                const x = i * width + 2 * i * margin + margin
                const y = canvas.height - height

                ctx.fillRect(x, y, width, height)
            }
        }
    }
</script>

<canvas bind:this={canvas} width={count * 100} height="1000" class="canvas"/>

<style lang="scss">
    .canvas {
        width: 100%;
        height: 100%;
    }
</style>
