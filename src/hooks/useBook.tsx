import React from "react";
import { useSupabase } from "./useSupabase";

import { Id, TableId } from "../types";
import BedRoom from "../types/bedroom";
import { PostgrestFilterBuilder, PostgrestQueryBuilder } from "@supabase/supabase-js";
import { useAuth } from "./useAuth";
import Employer from "../types/employer";

export type SupabaseSlt = PostgrestQueryBuilder<any, any, any, TableId, unknown>;
export type SupabaseSelect = PostgrestFilterBuilder<any, any, any, any[], TableId, unknown, "GET" | "RPC", false>;

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

export type LocalBook<T, R=T> = {
    add: (roomId: BedRoom.Id, data: T, description?: string) => Promise<void>,
    update: (id: number, data: Partial<TypeWithTrace<T>>, description?: string) => Promise<void>,
    cancel: (id: number) => Promise<void>,

    list: TypeWithTrace<R>[],
    getId: (id: Id) => TypeWithTrace<R> | null,
    getRoomId: (roomId: BedRoom.Id, and?: (data: TypeWithTrace<R>) => boolean) => TypeWithTrace<R> | null,
    getRooms: (roomId: BedRoom.Id, and?: (data: TypeWithTrace<R>) => boolean) => TypeWithTrace<R>[],
    getToday: () => TypeWithTrace<R>[];
}

export function useLocalData<T extends Object, R = T>(
    tableId: TableId,
    filter: (get: SupabaseSlt) => SupabaseSelect = e => e.select('*'),
    listenTables: TableId[] = [],
): LocalBook<T, R> {
    const mySupabase = useSupabase<T, TypeWithTrace<R>>(tableId,
        table => filter(table)
            .is('cancel_date', null)
            .order('created_date', { ascending: false }),
    listenTables);

    const { isAuth } = useAuth();
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

    const getRooms = React.useCallback((
        roomId: BedRoom.Id,
        and: (data: TypeWithTrace<R>) => boolean = () => true,
    ) => {
        return datas.filter(data => data.room_id === roomId && and(data));
    }, [datas]);

    const getToday = React.useCallback(() => {
        const today = new Date();
        return datas.filter(elem => elem.created_date.getDate() === today.getDate());
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
    }, [isAuth, mySupabase.add]);

    const update = React.useCallback(async (
        id: Id,
        data: Partial<TypeWithTrace<T>>,
        description?: string,
    ) => {
        const res: Partial<TypeWithTrace<T>> = { ...data, description, };
        await mySupabase.update(id, res);
    }, [mySupabase.update]);

    const cancel = React.useCallback(async (id: Id) => {
        await mySupabase.update(id, {
            cancel_date: new Date(),
            cancel_by: isAuth().id,
        } as Partial<TypeWithTrace<T>>);
    }, [isAuth, mySupabase.update]);

    return {
        list: datas,
        getId,
        getRoomId,
        getRooms,
        add,
        update,
        cancel,
        getToday
    };
}

