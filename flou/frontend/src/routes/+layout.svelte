<script lang="ts">
    import BackgroundBubbles from "$lib/components/background/BackgroundBubbles.svelte";
    import BackgroundWaves from "$lib/components/background/BackgroundWaves.svelte";
    import WeatherAnimation from "$lib/components/weather-animation/WeatherAnimation.svelte";
    import {
        useAccount,
        useCalendar,
        useColorChange,
        useCurrentBG,
        useCurrentColor,
        useDarkMode,
        usePomodorRoar,
        useRoar,
        useToDos,
        useWeather
    } from "$lib/contexts";


    useAccount()
    useToDos()
    useCalendar()
    const currBG = useCurrentBG()
    useColorChange()
    useCurrentColor()
    const darkMode = useDarkMode()
    const weather = useWeather()
    useRoar()
    usePomodorRoar()

    $: {
        if($darkMode) {
            //Dark Mode Logic
        } else {
            //Light Mode Logic
        }
    }
  
</script>

<div class="background">
    {#if $currBG === 1}
        <BackgroundBubbles/>
    {:else if $currBG === 2}
        <BackgroundWaves/>
    {/if}

</div>
<div class="weather-animation-container">
    <WeatherAnimation weather={$weather}/>
</div>
<slot/>

<style lang="scss">
  @import "themes";

  $input_color: var(--input_color);
  $input_background: var(--input_background);

  :global(*) {
    box-sizing: border-box;
  }

  :global(body) {
    width: 100vw;
    height: 100vh;
    margin: 0;
    overflow: hidden;

    font-family: sans-serif;
  }

  :global(.input) {
    width: 100%;

    display: flex;
    flex-direction: column;
    gap: 4px;

    :global(label) {
      font-size: 1.2rem;
    }

    :global(input) {
      padding: 10px;

      color: $input_color;
      background-color: $input_background;
      border-radius: 8px;
    }
  }

  .background {
    position: absolute;
    inset: 0;
    z-index: -2;
  }

  .weather-animation-container {
    position: absolute;
    inset: 0;
    z-index: -1;
  }
</style>
