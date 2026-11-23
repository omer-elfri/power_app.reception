import { getString } from ".";

export function getFrenchDate(date: Date) {
    return date.toLocaleDateString("fr-FR", {
        day: "2-digit",
        month: "long",
        year: "numeric",
    });
}

export function getFrenchDateTime(date: Date) {
    const now = Date.now();
    const day = 24 * 60 * 60 * 1000;
    const isOlderThanDay = now - date.getTime() >= day;
    return !isOlderThanDay ? getHour(date) : getFrenchDate(date).slice(0,6);
}

export function getTime(date: Date) {
    const now = Date.now();
    const day = 24 * 60 * 60 * 1000;
    const isOlderThanDay = now - date.getTime() >= day;
    return !isOlderThanDay ? getHour(date) : getDate(date);
}

export function getDate(date: Date) {
    const res = date.toLocaleDateString()
        .slice(0, 5).split("/").join(" / ");
    return res;
}

export function getHour(date: Date) {
    const res = date.toLocaleTimeString()
        .slice(0, 5);
    return res;
}

export function getDuration(start: Date, end: Date) {
    const total = Math.floor((end.getTime() - start.getTime()) / 60000);
    const j = Math.floor(total / 1440);
    const h = Math.floor((total % 1440) / 60);
    const min = total % 60;

    // if (start.getDate() < end.getDate())
    //     return getFrenchDate(end).slice(0,6);
    if (j) return `${j}j ${h}h`;
    // if (j) return getFrenchDate(end).slice(0,6);
    if (h) return `${getString(h)}h ${getString(min)}`;
    return `${min} min`;
}

export function strToDate<T extends Object>(stocked: string): T {
    const jsonDatas: T = JSON.parse(stocked, (_, value) => {
        if (typeof value === "string" &&
            /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?Z$/.test(value) )
            return new Date(value);
        return value;
    });
    return jsonDatas;
}



export function parseDates<T>(obj: T): T {
    if (Array.isArray(obj))
        return obj.map(parseDates) as T;

    if (obj === null || typeof obj !== 'object') {
        if (typeof obj === 'string' && /^[\[{]/.test(obj.trim())) {
            try {
                return parseDates(JSON.parse(obj)) as T;
            } catch {}
        }
        return obj;
    }

    return Object.fromEntries(
        Object.entries(obj).map(([key, value]) => [
            key,
            value != null && typeof value === 'string' &&
            /(^date$|_date$|_at$|^start$|^end|^done$)/i.test(key) &&
            !isNaN(Date.parse(value))
                ? new Date(value)
                : parseDates(value)
        ])
    ) as T;
}
