<script lang="ts">
    import {onMount} from "svelte";

    import {type AnimationHandler, height, width} from "$lib/components/weather-animation/animation-handler";
    import {error} from "$lib/util";

    export let handler: AnimationHandler
    
    let canvas: HTMLCanvasElement
    
    onMount(() => {
        const context = canvas.getContext("2d") ?? error("context is null")
        handler.start(context)
    })
</script>

<canvas bind:this={canvas} width={width} height={height}/>

<style lang="scss">
    canvas {
        width: 100%;
        height: 100%;
    }
</style>
