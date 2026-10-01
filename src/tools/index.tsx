export function uniqueId<T extends Record<string, any>>(
    tab: T[],
    key: keyof T = "id"
): T[] {
    const ids = tab.map(elem => elem[key]);

    if (ids.length !== new Set(ids).size)
        throw Error("Double id");
    return tab;
}

export function getTime(date: Date) {
    const now = Date.now();
    const day = 24 * 60 * 60 * 1000;
    const isOlderThanDay = now - date.getTime() >= day;
    return !isOlderThanDay ? getHour(date) : getDate(date);
}

export function getDate(date: Date) {
    const res = date.toLocaleDateString()
        .slice(0, 5);
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
