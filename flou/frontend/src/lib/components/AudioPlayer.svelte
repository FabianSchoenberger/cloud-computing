<script lang="ts">
    import {get} from "svelte/store";

    import type {Audio} from "$lib/api/audio";
    import Next from "$lib/assets/icon/next.svg?raw"
    import Pause from "$lib/assets/icon/pause.svg?raw"
    import Play from "$lib/assets/icon/play.svg?raw"
    import Previous from "$lib/assets/icon/previous.svg?raw"
    import IconButton from "$lib/components/IconButton.svelte";
    import {useRoar} from "$lib/contexts";
    import {debounce, mod} from "$lib/util";

    const roar = useRoar()

    export let audio: Audio[]
    let index = 0

    const current = roar.audio
    const playing = debounce(roar.playing, 1)
    const duration = debounce(roar.duration, 1)
    const seek = debounce(roar.seek, 1)
    // const volume = roar.volume
    // const mute = roar.mute

    let seekBar: HTMLDivElement
    $: fill = ($seek ?? 0) / ($duration ?? Infinity)
    let previewFill: number | undefined = undefined

    roar.on("end", () => next())

    // pre-load initial selected audio
    let load = false
    if ($current === undefined) {
        roar.load(audio[index])
        load = true
        preload()
    }

    // preload previous and next audio to avoid long waiting times
    function preload() {
        roar.preload(audio[decIndex(index)])
        roar.preload(audio[incIndex(index)])
    }

    function next() {
        index = incIndex(index)

        play()
        preload()
    }

    function previous() {
        index = decIndex(index)

        play()
        preload()
    }

    function incIndex(index: number) {
        return mod((index + 1), audio.length)
    }

    function decIndex(index: number) {
        return mod((index - 1), audio.length)
    }

    function play() {
        roar.play(audio[index])
        load = false
    }

    function pause() {
        roar.pause()
    }

    function unpause() {
        if (load) {
            play()
        } else {
            roar.unpause()
        }
    }

    function toString(time?: number): string {
        if (time === undefined)
            return "--:--"

        const totalSeconds = time / 1000

        const minutes = (totalSeconds / 60) | 0
        const seconds = (totalSeconds - minutes * 60) | 0

        return `${minutes}:${pad(seconds)}`
    }

    function pad(num: number): string {
        let result = num.toString();
        while (result.length < 2) result = "0" + result;
        return result;
    }

    function setSeek(event: MouseEvent) {
        const width = seekBar.getBoundingClientRect().width
        const x = event.offsetX
        roar.seek = (get(duration) ?? 0) * (x / width)
    }

    function previewSeek(event: MouseEvent) {
        const width = seekBar.getBoundingClientRect().width
        const x = event.offsetX
        previewFill = x / width
    }

    function resetFillPreview() {
        previewFill = undefined
    }
</script>

<div class="container">
    <div class="title">{$current?.title ?? "---"}</div>
    <div class="seek-bar-container">
        <span>{toString($seek)}</span>
        <!-- svelte-ignore a11y-no-static-element-interactions -->
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <div bind:this={seekBar} class="seek-bar" on:click={setSeek}
             on:mousemove={previewSeek} on:mouseleave={resetFillPreview}>
            <div class="bar">
                <div class="fill" style:width="{fill * 100}%" style:background-color="#404040"/>
                <div class="fill" style:width="{(previewFill ?? 0) * 100}%" style:background-color="#00000080"/>
            </div>
        </div>
        <span>{toString($duration)}</span>
    </div>
    <div class="controls">
        <IconButton on:click={previous}>{@html Previous}</IconButton>
        {#if $playing}
            <IconButton on:click={pause}>{@html Pause}</IconButton>
        {:else}
            <IconButton on:click={unpause}>{@html Play}</IconButton>
        {/if}
        <IconButton on:click={next}>{@html Next}</IconButton>
        <!--TODO volume control-->
    </div>
</div>

<style lang="scss">
  .container {
    width: 100%;
    height: 100%;

    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;
  }

  .title {
    font-size: 1.3rem;
    font-weight: bold;
  }

  .seek-bar-container {
    width: 100%;

    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 16px;

    .seek-bar {
      flex: 1;
      position: relative;
      height: 100%;

      .bar {
        position: absolute;
        top: calc(50% - 4px);
        bottom: calc(50% - 4px);
        left: 0;
        right: 0;

        overflow: hidden;

        background-color: #d0d0d0;
        border-radius: 8px;

        .fill {
          position: absolute;
          height: 100%;
        }
      }
    }
  }

  .controls {
    display: flex;
    flex-direction: row;
  }
</style>
