export function uniqueId<T extends Record<string, any>>(
    tab: T[],
    key: keyof T = "id"
): T[] {
    const ids = tab.map(elem => elem[key]);

    if (ids.length !== new Set(ids).size)
        throw Error("Double id");
    return tab;
}
