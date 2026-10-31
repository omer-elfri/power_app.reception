import React from "react";
import { useSupabase } from "./useSupabase";

import { Id, TableId } from "../../types";
import BedRoom from "../../types/bedroom";
import { PostgrestFilterBuilder } from "@supabase/supabase-js";
import { useAuth } from "../useAuth";
import Employer from "../../types/employer";

export type SupabaseSelect = PostgrestFilterBuilder<any, any, any, any[], string, unknown, "GET", false>;

export type TypeWithTrace<T> = T & {
    id: Id,
    room_id: BedRoom.Id,
    created_by: Employer.Id,
    created_date: Date,
    description?: string,
} & ({
    cancel_date: null,
    cancel_by: null,
} | {
    cancel_date: Date,
    cancel_by: Employer.Id,
})

export type LocalBook<T extends Object, R = T> = {
    add: (roomId: BedRoom.Id, data: T, description?: string) => Promise<void>,
    update: (id: number, data: Partial<TypeWithTrace<T>>, description?: string) => Promise<void>,
    cancel: (id: number) => Promise<void>,

    list: TypeWithTrace<R>[],
    getId: (id: Id) => TypeWithTrace<R> | null,
    getRoomId: (roomId: BedRoom.Id, and?: (data: TypeWithTrace<R>) => boolean) => TypeWithTrace<R> | null,
    getRooms: (roomId: BedRoom.Id) => TypeWithTrace<R>[],

    today: TypeWithTrace<R>[];
}

export function useLocalData<T extends Object, R = T>(
    tableId: TableId,
    filter?: (get: SupabaseSelect) => SupabaseSelect,
    listenTables: TableId[] = [],
): LocalBook<T, R> {
    const { isAuth } = useAuth();
    const mySupabase = useSupabase<T, TypeWithTrace<R>>(tableId, table => {
        return (filter ? filter(table) : table)
            .is('cancel_date', null)
            .order('created_date', { ascending: false })
    }, listenTables);
    const { datas } = mySupabase;

    const getId = React.useCallback((id: Id) => {
        return datas.find(data => data.id === id) ?? null;
    }, [datas]);

    const getRoomId = React.useCallback((
        roomId: BedRoom.Id,
        and: (data: TypeWithTrace<R>) => boolean = () => true,
    ) => {
        return datas.find(data => data.room_id === roomId && and(data)) ?? null;
    }, [datas]);

    const getRooms = React.useCallback((roomId: BedRoom.Id) => {
        return datas.filter(data => data.room_id === roomId) || null;
    }, [datas]);



    const add = React.useCallback(async (
        roomId: BedRoom.Id,
        data: T,
        description?: string,
    ) => {
        await mySupabase.add({
            ...data,
            room_id: roomId,
            created_by: isAuth().id,
            created_date: new Date(),
            description,
        });
    }, [isAuth, mySupabase]);

    const update = React.useCallback(async (
        id: Id,
        data: Partial<TypeWithTrace<T>>,
        description?: string,
    ) => {
        const res: Partial<TypeWithTrace<T>> = { ...data, description, };
        await mySupabase.update(id, res);
    }, [isAuth, mySupabase]);

    const cancel = React.useCallback(async (id: Id) => {
        await mySupabase.update(id, {
            cancel_date: new Date(),
            cancel_by: isAuth().id,
        } as Partial<TypeWithTrace<T>>);
    }, [isAuth, mySupabase]);

    const today = React.useMemo(() => {
        const today = new Date();
        return datas.filter(elem => elem.created_date.getDate() === today.getDate());
    }, [datas]);

    return {
        list: datas,
        getId,
        getRoomId,
        getRooms,
        add,
        update,
        cancel,
        today
    };
}

