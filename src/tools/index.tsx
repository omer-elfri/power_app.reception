import { TypeWithTrace } from "../hooks/bd/useBook";
import { TypeWithId } from "../types";

export function uniqueId<T extends Record<string, any>>(
    tab: T[], key: keyof T = "id"
): T[] {
    const ids = tab.map(elem => elem[key]);

    if (ids.length !== new Set(ids).size)
        throw Error("Double id");
    return tab;
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

export function getUniqueIds<T extends { id: string }>(
    tab: T[], list: T[]
) {
    return tab.filter(item => !list.some(obj => obj.id === item.id));
}

export function unifyIds<T extends { id: string }>(
    lists: T[][]
) {
    return [...new Set(lists.flat())];
}

export function getCommonIds<T extends { id: string }>(tabs: T[][]): T[] {
    const [first = [], ...rest] = tabs;

    return first.filter(item => rest.every(tab =>
        tab.some(obj => obj.id === item.id) ) );
}





export function getString(nb: number): string {
    return (nb < 10) ? `0${nb}` : String(nb);
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

