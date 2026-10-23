import React from "react";
import { useAuth } from "./useAuth";

import { strToDate } from "../tools/date";
import { Id, TypeWithTrace } from "../types";
import BedRoom from "../types/bedroom";

export type LocalBook<T extends Object> = {
    get: TypeWithTrace<T>[];
    getId: (id: Id) => TypeWithTrace<T> | null,
    add: (roomId: BedRoom.Id, data: T, description?: string) => void;
    update: (id: number, data: Partial<TypeWithTrace<T>>, description?: string) => void;
    today: TypeWithTrace<T>[];
}

export function useLocalData<T extends Object>(table: string): LocalBook<T> {
    const { addTrace } = useAuth();
    const [datas, setDatas] = React.useState<TypeWithTrace<T>[]>([]);

    React.useEffect(() => {
        const stocked = localStorage.getItem(table);
        if (!stocked) return;
        const book = strToDate<TypeWithTrace<T>[]>(stocked)
            ?.sort((a, b) => b.date.getTime() - a.date.getTime());
        if (book) setDatas(book);
    }, []);

    React.useEffect(() => {
        if (datas.length === 0) return;
        localStorage.setItem(table, JSON.stringify(datas));
    }, [datas]);

    const get = React.useMemo(() => {
        return datas.filter(data => !('cancel' in data));
    }, [datas]);

    const getId = React.useCallback((id: Id) => {
        return datas.find(data => data.id === id) ?? null;
    }, [datas]);

    const add = React.useCallback((
        roomId: BedRoom.Id, data: T,
        description?: string
    ) => {
        setDatas(list => {
            const id = list.length === 0 ? 0 : list[0].id + 1;
            const res = addTrace(id, roomId, data, description);
            return [res, ...list];
        });
    }, [addTrace]);

    const update = React.useCallback((
        id: number,
        data: Partial<TypeWithTrace<T>>,
        description?: string,
    ) => {
        setDatas(list => {
            const index = list.findIndex(elem => elem.id === id);
            if (index === -1) throw new Error("Cette donnée est introuvable");
            return list.map((elem, i) => (i === index)
                ? { ...elem, ...data, description } : elem);
        });
    }, []);

    const today = React.useMemo(() => {
        const today = new Date(Date.now());
        return get.filter(elem => elem.date.getDate() === today.getDate());
    }, [get]);

    return { get, getId, add, update, today };
}
