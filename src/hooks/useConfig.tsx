import React from "react";
import { strToDate } from "../tools/date";
import { ConfigType } from "../types";

export type Config<T extends Object> = {
    list: ConfigType<T>[];
    getId: (id: string) => ConfigType<T> | null,
    update: (id: string, data: Partial<ConfigType<T>>, description?: string) => void;
}

export function useConfig<T extends { id: string }>(table: string, initDatas: T[] = []): Config<T> {
    const [datas, setDatas] = React.useState<ConfigType<T>[]>(initDatas);

    React.useEffect(() => {
        const stocked = localStorage.getItem(table);
        if (!stocked) return;
        const book = strToDate<ConfigType<T>[]>(stocked);
        if (book) setDatas(book);
    }, []);

    React.useEffect(() => {
        if (datas.length === 0) return;
        localStorage.setItem(table, JSON.stringify(datas));
    }, [datas]);

    const list = React.useMemo(() => {
        return datas.filter(data => !('disabled' in data));
    }, [datas]);

    const getId = React.useCallback((id: string) => {
        return datas.find(data => data.id === id) ?? null;
    }, [datas]);

    const update = React.useCallback((
        id: string,
        data: Partial<ConfigType<T>>,
        description?: string,
    ) => {
        setDatas(list => {
            const index = list.findIndex(elem => elem.id === id);
            if (index === -1) throw new Error("Cette donnée est introuvable");
            return list.map((elem, i) => (i === index)
                ? { ...elem, ...data, description } : elem);
        });
    }, []);

    return { list, getId, update, };
}
