

<script lang="ts">
    import type {Audio} from "$lib/api/audio";
    import Pause from "$lib/assets/icon/pause.svg?raw"
    import Play from "$lib/assets/icon/play.svg?raw"
    import IconButton from "$lib/components/IconButton.svelte";
    import AnimationTimer from "$lib/components/timer-animation/AnimationTimer.svelte";
    import {usePomodorRoar} from "$lib/contexts";

    export let alarm: Audio

    const minToSec = (minutes:number) => minutes * 60;
    const secToMin = (seconds:number) => Math.floor(seconds / 60);
    const padWithZeroes = (number:number) => number.toString().padStart(2,'0');

    const POMODOR_S = minToSec(25);
    const LONG_BREAK_S = minToSec(20);
    const SHORT_BREAK_S = minToSec(5);

    const roar = usePomodorRoar();
    roar.preload(alarm)

    type State = "idle" | "progress" | "resting"
    let currState: State = "idle";
    const ALL_POMODOROS_COMPLETED = 4;
    let pomodoroTime = POMODOR_S;
    let completedPomodoros = 0;
    let interval:NodeJS.Timeout;
    let isRunning = false;

    let currentProgress: number; // For animation timer
    let currentRest: number;

    function startPomodoro(){
        isRunning = true;
        currState = "progress";
        interval = setInterval(() => {
            calcProgress(pomodoroTime,POMODOR_S);
            if (pomodoroTime === 0){
                completePomodoro();
            }
            pomodoroTime -= 1;
        },1000);
    }

    function completePomodoro(){
        clearInterval(interval);
        completedPomodoros++;
        roar.play(alarm);
        if (completedPomodoros === ALL_POMODOROS_COMPLETED){
            currentRest = LONG_BREAK_S;
            pomodoroTime = LONG_BREAK_S;
            rest();
            completedPomodoros = 0;
        } else {
            currentRest = SHORT_BREAK_S;
            pomodoroTime = SHORT_BREAK_S;
            rest();
        }
    }

    function rest(){
        isRunning = true;
        currState = "resting";
        interval = setInterval(() => {
            calcProgress(pomodoroTime,currentRest);
            if (pomodoroTime === 0) {
                idle();
            }
            pomodoroTime -= 1;
        },1000);
    }

    function idle(){
        currState = "idle";
        clearInterval(interval);
        pomodoroTime = POMODOR_S;
        calcProgress(pomodoroTime,POMODOR_S) // Make sure to show progress circle again
        roar.stop();
        isRunning = false;
    }

    function cancel(){
        isRunning = false;
        clearInterval(interval);
    }

    function calcProgress(remainingTime: number, totalTime: number){
        currentProgress = (remainingTime / totalTime) * 100;
    }

    function formatTime(timeInSec:number){
        const minutes = secToMin(timeInSec);
        const remainingSec = timeInSec % 60;
        return `${padWithZeroes(minutes)}:${padWithZeroes(remainingSec)}`;
    }

</script>

<div class="container">
    <div class="subText">
        {#if currState === "idle"}
            Start timer!
        {:else if currState === "progress"}
            Time to focus!
        {:else}
            Time for a break!
        {/if}
    </div>
    <AnimationTimer progress={currentProgress} countdownTime={formatTime(pomodoroTime)}></AnimationTimer>
    <div class="controls">
        {#if isRunning && (currState === 'resting' || currState === 'progress')}
            <IconButton on:click={cancel}>{@html Pause}</IconButton>
        {:else if !isRunning && currState === 'resting'}
            <IconButton on:click={rest}>{@html Play}</IconButton>
        {:else}
            <IconButton on:click={startPomodoro}>{@html Play}</IconButton>
        {/if}
    </div>
</div>

<style lang="scss">
  .container {
    width: 100%;
    height: 100%;
    padding: 12px;

    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;
  }

  .subText {
    font-size: 1.3rem;
    font-weight: bold;
  }
  .controls {
    display: flex;
    flex-direction: row;
  }

</style>
