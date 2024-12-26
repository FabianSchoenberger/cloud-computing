<script lang="ts">
    import type {CalendarEntry} from "$lib/api/calender";

    export let entry: CalendarEntry;

    function getDateFormatted(entry: CalendarEntry): string {
        const day = entry.start.getDate().toString().padStart(2, '0');
        const month = (entry.start.getMonth() + 1).toString().padStart(2, '0'); // Months start at 0
        const year = entry.start.getFullYear().toString();
        return `${day}.${month}.${year}`;
    }

    function getDurationString(entry: CalendarEntry): string {
        const startHours = entry.start.getHours().toString().padStart(2, '0');
        const startMinutes = entry.start.getMinutes().toString().padStart(2, '0');

        const endHours = entry.end.getHours().toString().padStart(2, '0');
        const endMinutes = entry.end.getMinutes().toString().padStart(2, '0');

        if (startHours == endHours && startMinutes == endMinutes) {
            return "ALL DAY"
        }
        return `${startHours}:${startMinutes} - ${endHours}:${endMinutes}`;
    }
</script>

<style>
    .entry {
        padding: 10px;
        margin: 5px 0;
        border-radius: 4px;
    }

    hr {
        height: 5px;
        background: currentColor;
    }

    p strong {
        font-size: 20px;
    }

</style>

<div class="entry">
    <h2>[{getDateFormatted(entry)}] {entry.name} </h2>
    <hr>
    <p><strong>{getDurationString(entry)}</strong></p>
    <p>{entry.description || "No description" }</p>

</div>