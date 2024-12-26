<script lang="ts">
    import type {CalendarEntry} from "$lib/api/calender.js";
    import CalenderItem from "$lib/components/CalenderItem.svelte";

    export let entries: CalendarEntry[]

    $: sortedFilteredEntries = entries
        .filter(entry => entry.start >= new Date())  //show only entries starting from today
        .sort((a, b) => a.start.getTime() - b.start.getTime());  // sort it ascending
</script>

<div class="calender-container">
    <div class="header-container">
        <div>Calender</div>
    </div>

    <ul class="entry-list">
        {#each sortedFilteredEntries as entry}
            <li>
                <CalenderItem {entry}/>
            </li>
        {/each}
    </ul>
</div>

<style>
    .header-container {
        display: flex;
        align-items: center;
        padding: 20px 40px 20px 20px;
        font-size: 30px;
    }

    .calender-container {
        margin: 40px;
    }

    div {
        margin-bottom: 1rem;
    }

    .entry-list {
        list-style-type: none;
        padding-left: 10px;
        padding-right: 40px;

        max-height: 800px;
        overflow-y: auto;

    }

    /*Scrollbar Styling -----------------------------------------------*/

    /* Scrollbar Track */
    .entry-list::-webkit-scrollbar-track {
        background: grey;
        border-radius: 10px;
    }

    /* Scrollbar Thumb */
    .entry-list::-webkit-scrollbar-thumb {
        background: currentColor;
        border-radius: 10px;
    }

    /* Scrollbar Thumb on hover */
    .entry-list::-webkit-scrollbar-thumb:hover {
        background: #555;
    }

    /* Scrollbar itself */
    .entry-list::-webkit-scrollbar {
        width: 12px;
    }

</style>