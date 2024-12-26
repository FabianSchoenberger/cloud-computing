import {icsCalendarToObject} from "ts-ics";

export interface CalendarEntry {
    name: string;
    description: string;
    start: Date;
    end: Date;
}

export const calendar = {
    get: async function (fetch: typeof window.fetch, url: string): Promise<CalendarEntry[]> {
        const response = await fetch(url)
        const text = await response.text()
        return parseICS(text)
    }
}

function parseICS(value: string): CalendarEntry[] {
    const result = [];

    const calendar = icsCalendarToObject(value);
    for (const eventEntry of calendar.events?.entries() ?? []) {
        let endDate: Date;
        if (eventEntry[1].end === undefined) {
            endDate = eventEntry[1].start.date
        } else {
            endDate = eventEntry[1].end.date
        }

        const calendarEntry: CalendarEntry = {
            name: eventEntry[1].summary,
            description: eventEntry[1].description || "No description",
            start: new Date(eventEntry[1].start.date),
            end: endDate
        }
        result.push(calendarEntry)
    }

    return result
}
