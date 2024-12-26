<script lang="ts">
import {onMount} from "svelte";

import {error} from "$lib/util";

let canvas: HTMLCanvasElement;
let ctx: CanvasRenderingContext2D

let innerHeight: number
let innerWidth: number

onMount(() => {
    ctx = canvas.getContext("2d") ?? error()
})

</script>

<div class="container">
    <div class="background-wrapper">
        <div class="sky"></div>
        <div class="water"></div>
    </div>
    <img src="/src/lib/components/background/svg/bg.svg" alt="palmtree" class="bg">
    <canvas bind:this={canvas} width={1450} height={1450 * 16/9}/>
</div>

<svelte:window bind:innerWidth={innerWidth} bind:innerHeight={innerHeight}/>

<style lang="scss">
  .container {
    width: 100%;
    height: 100%;
  }

  .background-wrapper {
    position: absolute;
    top:0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: -100;
  }

  .sky {
    background: rgb(53,78,162);
    background: linear-gradient(180deg, rgba(53,78,162,1) 0%, rgba(88,87,153,1) 36%, rgba(208,145,164,1) 72%, rgba(230,215,117,1) 100%);
    height: 50%
  }

  .water {
    background: rgb(53,78,162);
    background: linear-gradient(0deg, rgba(53,78,162,1) 0%, rgba(88,87,153,1) 6%, rgba(208,145,164,1) 45%, rgba(230,215,117,1) 71%);
    top:50%;
    height: 50%;
  }

  .bg {
    position: absolute;
    bottom: 0%;

    width:100%;
    height: 100%;

  }

  canvas {
    width: 100%;
    height: 100%;
  }
</style>
