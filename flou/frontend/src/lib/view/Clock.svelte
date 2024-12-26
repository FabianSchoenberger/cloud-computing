<script lang="ts">
    import moment from "moment";
    import {onMount} from "svelte";

    let date = new Date();
    onMount(() => {
        const interval = setInterval(() => {
            date = new Date();
        }, 1000);

        return () => {
            clearInterval(interval);
        };
    });
</script>

<div class="clock">
    <span class="time">{moment(date).format("HH:mm")}</span>
    <span class="date">{moment(date).format("DD.MM.YYYY")}</span>
</div>

<style lang="scss">
    .clock {
      margin-top: 20%;

      display: flex;
      flex-direction: column;
      justify-content: center;

      color: var(--surface_color);
      font-weight: bold;
      letter-spacing: 2px;
    }

    .time {
      font-size: 80px;
    }

    .date {
      font-size: 40px;
    }
</style>