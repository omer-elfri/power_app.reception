import React from "react";
import { useAuth } from "./useAuth";
import { TableId } from "./useConfig";

import { Id } from "../types";
import BedRoom from "../types/bedroom";
import Employer from "../types/employer";
import { DB, Key_String } from "../tools/database";

export type TypeWithTrace<T> = T & {
    id: Id,
    roomId: BedRoom.Id,
    auth_session: Employer.Id,
    date: Date,
    description?: string,
}

export type LocalBook<T extends Object> = {
    get: TypeWithTrace<T>[];
    getId: (id: Id) => TypeWithTrace<T> | null,
    getRoomId: (roomId: BedRoom.Id) => TypeWithTrace<T> | null,
    add: (roomId: BedRoom.Id, data: T, description?: string) => void;
    update: (id: number, data: Partial<TypeWithTrace<T>>, description?: string) => void;
    today: TypeWithTrace<T>[];
}

export function useLocalData<T extends Object>(table: TableId, tableObj: Key_String<T>): LocalBook<T> {
    const { isAuth } = useAuth();
    const [datas, setDatas] = React.useState<TypeWithTrace<T>[]>([]);

    React.useEffect(() => { // create table
        (async () => {
            await DB.createTable<Key_String<TypeWithTrace<T>>>(
                table, { ...tableObj, 
                id: "INTEGER PRIMARY KEY AUTOINCREMENT",
                roomId: "TEXT NOT NULL",
                auth_session: "TEXT NOT NULL",
                date: "TEXT NOT NULL",
                description: "TEXT",
            } );
            await readTable();
        })();
    }, []);

    const get = React.useMemo(() => {
        return datas.filter(data => !('cancel' in data) || !data.cancel);
    }, [datas]);

    const getId = React.useCallback((id: Id) => {
        return datas.find(data => data.id === id) ?? null;
    }, [datas]);

    const getRoomId = React.useCallback((roomId: BedRoom.Id) => {
        return get.find(data => data.roomId === roomId) ?? null;
    }, [get]);

    const readTable = React.useCallback( // read table
        async (): Promise<TypeWithTrace<T>[]
    > => {
        let stockedRows = await DB.readTable<TypeWithTrace<T>>(table)
        stockedRows.sort((a, b) => b.date.getTime() - a.date.getTime());
        setDatas(stockedRows);
        return stockedRows;
    }, []);

    const add = React.useCallback(async (
        roomId: BedRoom.Id,
        data: T,
        description?: string,
    ) => {
        await DB.insert_ignore<TypeWithTrace<T>>(table, {
            ...data, roomId,
            date: new Date(),
            auth_session: isAuth().id,
            description,
        } as Omit<TypeWithTrace<T>, 'id'> ).then(readTable);
    }, [datas, isAuth]);

    const update = React.useCallback(async (
        id: Id,
        data: Partial<TypeWithTrace<T>>,
        description?: string,
    ) => {
        await DB.update<TypeWithTrace<T>>(table, id, { ...data, description }).then(readTable);
    }, [datas]);

    const today = React.useMemo(() => {
        const today = new Date();
        return get.filter(elem => elem.date.getDate() === today.getDate());
    }, [get]);

    return { get, getId, getRoomId, add, update, today };
}

