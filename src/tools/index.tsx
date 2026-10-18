import { TypeWithId, TypeWithTrace } from "../types";

export function uniqueId<T extends Record<string, any>>(
    tab: T[],
    key: keyof T = "id"
): T[] {
    const ids = tab.map(elem => elem[key]);

    if (ids.length !== new Set(ids).size)
        throw Error("Double id");
    return tab;
}

export function getFrenchDate(date: Date) {
    return date.toLocaleDateString("fr-FR", {
        day: "numeric",
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

export function formatPrice(price: number) {
    let res = "";
    for (let tmp = price; tmp > 0; tmp = Math.trunc(tmp/1000)) {
        let a = tmp % 1000;
        let aStr = (a === 0) ? "000" : a.toString();
        res = (res === "") ? aStr : aStr + "." + res;
    }
    return res;
}

export function toTab<T extends Record<string, object>>(d: T)
    : TypeWithId<T[keyof T]>[]
{
    return Object.entries(d).map(([id, data]) => (
        { id, ...data, }  as TypeWithId<T[keyof T]>
    ));
}

export function updateTab<T>(tab: T[], id: number, data: T): T[]
{
    tab = [...tab];
    tab[id] = data;
    return tab;
}

export function addTab<T>(tab: T[], data: T): T[]
{
    return [data, ...tab];
}






export function string_object<T>(key: string) {
    const stocked = localStorage.getItem(key);
    if (!stocked) return;

    const jsonDatas: T = JSON.parse(stocked, (_, value) => {
        if (typeof value === "string" &&
            /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?Z$/.test(value) )
            return new Date(value);
        return value;
    });
    return jsonDatas;
}

export function getString(nb: number): string {
    if (nb < 10) {
        return `0${nb}`;
    }
    return String(nb);
}


export function getPerIdBook2
<T extends Object, K extends keyof TypeWithTrace<T>>(
    datas: TypeWithTrace<T>[],
    key: K = 'roomId' as K,
    max?: number,
) {
    const res: Partial<Record<
        TypeWithTrace<T>[K] & PropertyKey,
        TypeWithTrace<T> >> = {};

    for (const elem of datas) {
        const k = elem[key] as TypeWithTrace<T>[K] & PropertyKey;
        if (!res[k]) {
            res[k] = elem;
            const nbRes = Object.values(res).length;
            if (max === nbRes) break;
        }
    }
    return res;
}

export function getDuration(start: Date, end: Date) {
    const total = Math.floor((end.getTime() - start.getTime()) / 60000);

    // start.setDate(Date.(2,11,2020))

    const j = Math.floor(total / 1440);
    const h = Math.floor((total % 1440) / 60);
    const min = total % 60;

    if (start.getDate() < end.getDate())
        return getFrenchDate(end).slice(0,6);

    if (j) return `${j}j ${h}h`;
    if (h) return `${h}h ${min}m`;
    return `${min}m`;
}

