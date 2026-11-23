import React from "react";
import { useVisual } from "./useVisual";
import { SupabaseSelect, SupabaseSlt } from "./useBook";

import { TableId } from "../types";
import { supabase } from "../tools/supabase";
import { parseDates } from "../tools/date";

export type SupabaseContext<R> = {
    datas: R[],
    obsolet: boolean,
    getId: (id: string | number) => R | null,
    read: () => Promise<R[]>,
    add: (newDatas: Object) => Promise<R>,
    update: (id: string | number, updatedDatas: Partial<R>) => Promise<R>,
};

export function useSupabase<R extends { id: string | number}>(
    tableId: TableId,
    filter: (table: SupabaseSlt) => SupabaseSelect = e => e.select('*'),
    listenTables: TableId[] = [],
): SupabaseContext<R> {
    const [obsolet, setObsolet] = React.useState(true);
    const [datas, setDatas] = React.useState<R[]>([]);
    const { setLoading } = useVisual();

    React.useEffect(() => {
        let previousState = false;
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (_, session) => {
                const isConnected = !!session;
                if (previousState === isConnected) return;
                previousState = isConnected;
                return isConnected ? read() : null;
            });
        return subscription.unsubscribe;
    }, [supabase.auth]);

    React.useEffect(() => {
        const channels = [tableId, ...listenTables].map(tableId2 => {
            return supabase
                .channel(`realtime-${tableId}-${tableId2}`)
                .on('postgres_changes', {
                    event: '*',
                    schema: 'public',
                    table: tableId2,
                }, read)
                .subscribe();
        });
        return () => channels.forEach(supabase.removeChannel);
    }, []);

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

    const read = React.useCallback(async (): Promise<R[]> => {
        return await manager(async () => {
            setObsolet(true);
            const { data, error } = await filter( supabase.from(tableId) );
            if (error) throw Error(`Get à échoué: ${error.message} !`);
            console.log("get ", tableId);
            setObsolet(false);
            const res = parseDates(data) as any[];
            setDatas(res);
            return res;
        });
    }, []);

    const add = React.useCallback(async (
        newDatas: Object,
    ): Promise<R> => {
        return await manager(async () => {
            setLoading(true);
            await new Promise(resolve => setTimeout(resolve, 3000));
            const { error } = await supabase
                .from(tableId)
                .insert(newDatas as any);
            if (error) throw Error(`L'ajout a échoué: ${error.message} !`);
            console.log("add ", tableId, datas);
            // setDatas(datas => [...datas, newDatas]);
            setObsolet(true);
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
            console.log("update", tableId, datas);
            setDatas(datas => datas.map(data => (data.id === id)
                ? { ...data, updatedDatas } : data) );
            setObsolet(true);
        });
    }, []);

    return { datas, obsolet, getId, read, add, update };
}

