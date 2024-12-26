<script lang="ts">
    import type {WeatherResponse} from "$lib/api/weather";
    import IconCloudy from "$lib/assets/icon/weather/cloudy.svg?raw";
    import IconRainy from "$lib/assets/icon/weather/rainy.svg?raw";
    import IconSnowy from "$lib/assets/icon/weather/snowy.svg?raw";
    import IconSunny from "$lib/assets/icon/weather/sunny.svg?raw";
    import IconSunnyCloud from "$lib/assets/icon/weather/sunnyCloud.svg?raw";
    import IconThunderstorm from "$lib/assets/icon/weather/thunderstorm.svg?raw";
    import {
        codesCloudy,
        codesFreezingRain,
        codesHail,
        codesRain,
        codesSleet,
        codesSnow, codesSunny, codesSunnyCloudy,
        codesThunder
    } from "$lib/components/weather-animation/animation-handler";

    export let weather: WeatherResponse | undefined = undefined
    $: icon = decode(weather?.current.condition.code ?? 0)

    export function decode(code: number): string {
        if (codesSunny.includes(code))
            return IconSunny

        if (codesCloudy.includes(code))
            return IconCloudy

        if (codesSunnyCloudy.includes(code))
            return IconSunnyCloud

        if (
            codesRain.includes(code) ||
            codesSleet.includes(code) ||
            codesFreezingRain.includes(code)
        ) return IconRainy

        if (codesThunder.includes(code))
            return IconThunderstorm

        if (
            codesSnow.includes(code) ||
            codesHail.includes(code)
        ) return IconSnowy

        return ""
    }
</script>

<div class="weather">
    <div class="icon">
        {@html icon}
    </div>
    <div class="info">
        <span class="temp">
            {#if weather}
                {weather.current.temp_c} °C
            {:else}
                Loading...
            {/if}
        </span>
        <span class="location">
            {#if weather}
                {weather.location.name}, {weather.location.country}
            {:else}
                Loading...
            {/if}
        </span>
    </div>
</div>

<style lang="scss">
  .weather {
    width: 100%;
    height: 100%;
    padding: 12px;

    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    gap: 40px;

    .icon {
      width: 200px;
      aspect-ratio: 1;

      display: flex;
      justify-content: center;
      align-items: center;
    }

    .info {
      display: flex;
      flex-direction: column;

      .temp {
        font-size: 5rem;
      }

      .location {
        font-size: 2rem;
      }
    }
  }
</style>
