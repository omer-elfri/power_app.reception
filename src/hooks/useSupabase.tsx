import React from "react";
import { useVisual } from "./useVisual";
import { SupabaseSelect, SupabaseSlt } from "./useBook";

import { TableId } from "../types";
import { supabase } from "../tools/supabase";
import { parseDates } from "../tools/date";
import { RealtimePostgresChangesPayload } from "@supabase/supabase-js";

type ObsoletStatus = 'loading' | 'failed' | 'done';

export type SupabaseContext<R> = {
    datas: R[],
    obsolet: ObsoletStatus | null,
    getId: (id: string | number) => R | null,
    read: () => Promise<R[]>,
    add: (newDatas: Omit<R, 'id'>) => Promise<R>,
    update: (id: string | number, updatedDatas: Partial<R>) => Promise<R>,
};

export type SupabaseObject = {
    filter?: (table: SupabaseSlt) => SupabaseSelect,
    listenTables?: TableId[],
    onChange?: (payload: RealtimePostgresChangesPayload<Object>) => void,
}

export function useSupabase<R extends { id: string | number}>(
    tableId: TableId, {
        filter = e => e.select('*'),
        listenTables = [],
        onChange,
    }: SupabaseObject,
): SupabaseContext<R> {
    const [obsolet, setObsolet] = React.useState<ObsoletStatus | null>(null);
    const [datas, setDatas] = React.useState<R[]>([]);
    const { online, setLoading, } = useVisual();

    const read = React.useCallback(async (): Promise<R[]> => {
        return await manager(async () => {
            setObsolet('loading');
            const { data, error } = await filter( supabase.from(tableId) );
            if (error) throw Error(`Get à échoué: ${error.message} !`);
            console.log("get ", tableId);
            setObsolet('done');
            const res = parseDates(data) as any[];
            setDatas(res);
            return res;
        });
    }, []);

    React.useEffect(() => { // realtime
        const channels = [tableId, ...listenTables]
            .map(tableId2 => supabase
                .channel(`realtime-${tableId}-${tableId2}`)
                .on('postgres_changes', {
                    event: '*',
                    schema: 'public',
                    table: tableId2,
                }, payload => {
                    onChange?.(payload);
                    read();
                })
                .subscribe()
            );
        return () => channels
            .forEach(supabase.removeChannel);
    }, []);

    React.useEffect(() => { // get when online & failed
        if (online && obsolet === 'failed') read();
    }, [online, obsolet]);

    const manager = React.useCallback(async (
        handler: () => Promise<any>,
    ): Promise<any> => {
        try {
            console.log("... ", tableId);
            const res = await handler();
            setLoading(false);
            return res;
        }
        catch(err: any) {
            setLoading(false);
            throw ['error', err.message];
        }
    }, []);

    const getId = React.useCallback((id: string | number) => {
        return datas.find(data => data.id === id) ?? null;
    }, [datas]);

    const add = React.useCallback(async (
        newDatas: Omit<R, 'id'>,
    ): Promise<R> => {
        return await manager(async () => {
            setLoading(true);
            await new Promise(resolve => setTimeout(resolve, 3000));
            const { error } = await supabase
                .from(tableId)
                .insert(newDatas as any);
            if (error) throw Error(`L'ajout a échoué: ${error.message} !`);
            console.log("add ", tableId, datas);
            // setDatas(datas => [...datas, {...newDatas, id: 0} as R]);
            setObsolet('failed');
        });
    }, []);

    const update = React.useCallback(async (
        id: string | number,
        updatedDatas: Partial<R>,
    ): Promise<R> => {
        return await manager(async () => {
            setLoading(true);
            await new Promise(resolve => setTimeout(resolve, 3000));
            const { error } = await supabase
                .from(tableId)
                .update(updatedDatas as any)
                .eq('id', id);
            if (error) throw Error(`La modification a échoué: ${error.message} !`);
            console.log("update", tableId, id, datas);
            setDatas(datas => datas.map(data => (data.id === id)
                ? { ...data, ...updatedDatas } : data) );
            setObsolet('failed');
        });
    }, []);

    return { datas, obsolet, getId, read, add, update };
}

