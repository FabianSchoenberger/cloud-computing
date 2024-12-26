<script lang="ts">
    import type {WeatherResponse} from "$lib/api/weather";
    import Animation from "$lib/components/weather-animation/Animation.svelte";
    import {type AnimationHandler, decode} from "$lib/components/weather-animation/animation-handler";

    export let weather: WeatherResponse | undefined = undefined
    $: {
        if (weather !== undefined)
            animate(weather)
    }

    let _handlers: AnimationHandler[] = []

    function animate(weather: WeatherResponse) {
        _handlers?.forEach(stop)

        _handlers = decode(weather?.current.condition.code)
    }
</script>

<div class="weather-animation">
    {#each _handlers as handler}
        <div class="animation">
            <Animation {handler}/>
        </div>
    {/each}
</div>

<style lang="scss">
  .weather-animation {
    position: relative;
    width: 100%;
    height: 100%;
  }

  .animation {
    position: absolute;
    inset: 0;
  }
</style>
