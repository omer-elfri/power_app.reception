import React from "react";
import { SupabaseObject, useSupabase } from "./useSupabase";

import { Id, TableId } from "../types";
import BedRoom from "../types/bedroom";
import { PostgrestFilterBuilder, PostgrestQueryBuilder } from "@supabase/supabase-js";
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

export type LocalBook<R> = {
    add: (roomId: BedRoom.Id, data: R, description?: string) => Promise<TypeWithTrace<R>>,
    update: (id: number, data: Partial<TypeWithTrace<R>>) => Promise<TypeWithTrace<R>>,
    cancel: (id: number) => Promise<TypeWithTrace<R>>,

    list: TypeWithTrace<R>[],
    getId: (id: Id) => TypeWithTrace<R> | null,
    read: () => Promise<R[]>,
    getRoomId: (roomId: BedRoom.Id, and?: (data: TypeWithTrace<R>) => boolean) => TypeWithTrace<R> | null,
    getRooms: (roomId: BedRoom.Id) => TypeWithTrace<R>[],
    getToday: () => TypeWithTrace<R>[];
}

export function useLocalData<R extends Object>(
    tableId: TableId, {
        filter = e => e.select('*'),
        ...props
    }: SupabaseObject,
): LocalBook<R> {

    const mySupabase = useSupabase<TypeWithTrace<R>>(tableId, {
        filter: table => filter(table)
            .is('cancel_date', null)
            .order('created_date', { ascending: false }),
        ...props,
    });

    const isAuth = () => null;
    // const { isAuth } = useDataContext();
    const { datas } = mySupabase;

    const getRoomId = React.useCallback((
        roomId: BedRoom.Id,
        and: (data: TypeWithTrace<R>) => boolean = () => true,
    ) => {
        return datas.find(data =>
            data.room_id === roomId &&
            and(data) ) ?? null;
    }, [datas]);

    const getRooms = React.useCallback((
        roomId: BedRoom.Id,
    ) => {
        return datas.filter(data =>
            data.room_id === roomId);
    }, [datas]);

    const getToday = React.useCallback(() => {
        const today = new Date();
        return datas.filter(elem =>
            elem.created_date.getDate() === today.getDate());
    }, [datas]);


    const add = React.useCallback(async (
        roomId: BedRoom.Id,
        data: R,
        description?: string,
    ) => {
        return await mySupabase.add({
            room_id: roomId,
            created_by: 0,// isAuth().id,
            created_date: new Date(),
            cancel_date: null,
            cancel_by: null,
            description, ...data,
        } as Omit<TypeWithTrace<R>, 'id'>);
    }, [isAuth, mySupabase.add]);

    const cancel = React.useCallback(async (
        id: Id,
    ) => {
        return await mySupabase.update(id, {
            cancel_date: new Date(),
            cancel_by: 0,//isAuth().id,
        } as Partial<TypeWithTrace<R>>);
    }, [isAuth, mySupabase.update]);


    return {
        list: datas, add, cancel,
        getRoomId, getRooms, getToday,
        getId: mySupabase.getId,
        read: mySupabase.read,
        update: mySupabase.update,
    };
}

