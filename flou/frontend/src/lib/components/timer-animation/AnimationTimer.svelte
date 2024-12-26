<script lang="ts">
    import {onMount} from "svelte";

    // Info: Prepared for later, if you don't want to use hardcoded values
    // export let svgWidth: string;
    // export let svgHeight: string;
    // export let outerRadius: string;
    // export let outerCenterX: string;
    // export let outerCenterY: string;
    // export let innerRadius: string;
    // export let innerCenterX: string;
    // export let innerCenterY: string;
    export let progress: number;
    export let countdownTime: string;

    let progressCircle: SVGCircleElement;
    let circumference: number;

    $: setProgress(progress)

    onMount(() => {
        const radius = progressCircle.r.baseVal.value;
        circumference = radius * 2 * Math.PI;
        progressCircle.style.strokeDasharray = `${circumference}`;
    });

    function setProgress(percent: number) {
        if(progressCircle === undefined) return
        let val = `${circumference - (percent / 100) * circumference}`
        progressCircle.style.strokeDashoffset = val;
    }
</script>

<style>
    .track {
        stroke-width: 10;
        stroke: lightgrey;
        fill: none;
    }

    .progress {
        stroke-width: 10;
        stroke: black;
        stroke-linecap: round;
        fill: none;
        transform: rotate(270deg);
        transform-origin: center;
    }

    .countdown{
        display: block;
        font-size: 2em;
        font-weight: 300;
        margin-bottom: 0.2em;
    }
</style>

<svg width="150" height="150">
    <circle r="70" cx="75" cy="75" class="track"></circle>
    <circle bind:this={progressCircle} r="70" cx="75" cy="75" class="progress"></circle>
    <text x="35" y="85" class="countdown">{countdownTime}</text>
</svg>
