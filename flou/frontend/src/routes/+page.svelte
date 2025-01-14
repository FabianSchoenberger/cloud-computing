<script lang="ts">
    import {onMount} from "svelte";

    import {action} from "$lib";
    import type {Audio} from "$lib/api/audio";
    import IconMusic from "$lib/assets/icon/music.svg?raw";
    import IconTimer from "$lib/assets/icon/timer.svg?raw";
    import IconWeather from "$lib/assets/icon/weather.svg?raw";
    import Lofi from "$lib/assets/music/Colorful Flowers.mp3";
    import Rain from "$lib/assets/music/Rain.mp3";
    import BrownNoise from "$lib/assets/music/brown noise.mp3";
    import Alarm from "$lib/assets/music/school-bell.mp3";
    import AudioPlayer from "$lib/components/AudioPlayer.svelte";
    import AudioVisualiser from "$lib/components/AudioVisualizer.svelte";
    import Calender from "$lib/components/Calender.svelte";
    import IconButton from "$lib/components/IconButton.svelte";
    import Timer from "$lib/components/Timer.svelte";
    import ToDoList from "$lib/components/ToDoList.svelte";
    import Weather from "$lib/components/Weather.svelte";
    import {useAccount, useCalendar, useToDos, useWeather} from "$lib/contexts";
    import Clock from "$lib/view/Clock.svelte";
    import TopBar from "$lib/view/TopBar.svelte";

    type View = "timer" | "weather" | "audio"

    export let data
    export let form

    const account = useAccount()
    const calendar = useCalendar()
    const todos = useToDos()
    const weather = useWeather()

    $: $account = data.account
    $: $calendar = data.calendar
    $: $todos = data.todos
    $: {
        if (form !== null)
            $weather = form.weather
    }

    $: {
        if (form !== null && form.todoEvent !== undefined && $todos !== undefined) {
            const todoEvent = form.todoEvent
            switch (form.todoEvent.event) {
                case "POST":
                    todos.update(it => [...it ?? [], todoEvent.todo])
                    break;
                case "PUT":
                    todos.update(it => it?.toSpliced(it.findIndex(it => it.id === todoEvent.todo.id), 1, todoEvent.todo))
                    break;
                case "DELETE":
                    todos.update(it => it?.toSpliced(it.findIndex(it => it.id === todoEvent.todo.id), 1))
                    break;
            }
        }
    }

    let view: View = "timer"

    function setView(value: View) {
        view = value
    }

    const logout = async () => {
        await action("?/logout")
    }

    const audio: Audio[] = [
        {
            title: "Colorful Flowers",
            src: Lofi
        },
        {
            title: "Rain",
            src: Rain
        },
        {
            title: "Brown Noise",
            src: BrownNoise
        }
    ]

    let alarm: Audio = {
        title: "School Bell",
        src: Alarm
    }

    onMount(() => {
        // sync weather every 10 min
        syncWeather()
        setInterval(() => syncWeather(), 1000 * 60 * 10)
    })

    function syncWeather() {
        // Commented out: this only works with https, currently we are using http
        // navigator.geolocation.getCurrentPosition(position => {
        //     action("?/sync-weather", {
        //         latitude: `${position.coords.latitude}`,
        //         longitude: `${position.coords.longitude}`
        //     })
        // })

        // Hardcoded coordinates for Linz, Austria
        action("?/sync-weather", {
            latitude: "48.3069",
            longitude: "14.286"
        });
    }
</script>

<div class="container">
    <TopBar on:logout={logout}/>
    <div class="content">
        <div class="left">
            <ToDoList todos={$todos}/>
        </div>
        <div class="middle">
            <Clock/>

            <div class="main">
                <div class="view">
                    {#if view === "timer"}
                        <div class="timer">
                            <Timer {alarm}/>
                        </div>
                    {:else if view === "weather"}
                        <div class="weather">
                            <Weather weather={$weather}/>
                        </div>
                    {:else if view === "audio"}
                        <div class="audio">
                            <AudioPlayer {audio}/>
                        </div>
                    {/if}
                </div>
                <div class="view-control">
                    <IconButton size={3} on:click={() => setView("timer")}>{@html IconTimer}</IconButton>
                    <IconButton size={3} on:click={() => setView("weather")}>{@html IconWeather}</IconButton>
                    <IconButton size={3} on:click={() => setView("audio")}>{@html IconMusic}</IconButton>
                </div>
            </div>

            <div class="audio-visualizer">
                <AudioVisualiser count={64} maxHeight={1} minHeight={30} margin={10} color="rgb(0 0 0 / 100%)"/>
            </div>
        </div>
        <div class="right">
            <Calender entries={$calendar ?? []}/>
        </div>
    </div>
</div>

<style lang="scss">
  .container {
    width: 100%;
    height: 100%;

    display: flex;
    flex-direction: column;
  }

  .content {
    flex: 1;
    margin: 36px 36px 0;

    display: flex;
    flex-direction: row;

    border-radius: 12px 12px 0 0;

    color: var(--surface_color);
    background-color: var(--surface_background);

    .left, .middle, .right {
      flex: 1;
      width: 100%;
    }

    .middle {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      align-items: center;

      .main {
        width: 100%;
        height: 50%;

        display: flex;
        flex-direction: column;
        align-items: center;

        .view {
          width: 100%;
          height: 100%;

          display: flex;
          align-items: center;
          justify-content: center;
        }

        .audio {
          width: 100%;
        }

        .view-control {
          position: relative;
          margin-top: 32px;

          display: flex;
          flex-direction: row;
          gap: 16px;
        }
      }

      .audio-visualizer {
        width: 100%;
        z-index: -1;
      }
    }
  }
</style>
