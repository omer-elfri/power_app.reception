import React from "react";
import { useVisual } from "./useVisual";
import { SupabaseSelect, SupabaseSlt } from "./useBook";

import { TableId } from "../types";
import { supabase } from "../tools/supabase";
import { parseDates } from "../tools/date";

export function useSupabase<T extends Object, R extends { id: string | number} = T &  { id: string | number}>(
    tableId: TableId,
    filter: (table: SupabaseSlt) => SupabaseSelect = e => e.select('*'),
    listenTables: TableId[] = [],
) {
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

    const read = React.useCallback(async (): Promise<R[]> => {
        return manager(async () => {
            setObsolet(true);
            const { data, error } = await filter( supabase.from(tableId) );
            if (error) throw Error(`Get à échoué: ${error.message} !`);
            console.log("get ", tableId);
            setObsolet(false);
            if (tableId === 'bedroom_table')
                console.log("last_clean", data[2].room_id, data[2].lastClean);
            const res = parseDates(data) as any[];
            console.log("res", res)
            setDatas(res);
            return res;
        });
    }, []);

    React.useEffect(() => {
        const channel = supabase
            .channel(`realtime-${tableId}`);
        [tableId, ...listenTables].forEach(tableId2 => {
            channel.on('postgres_changes', {
                event: '*',
                schema: 'public',
                table: tableId2,
            }, read);
        })
        channel.subscribe();

        return () => {
            void supabase.removeChannel(channel);
        };
    }, []);

    const add = React.useCallback(async (
        newDatas: T,
    ) => {
        return manager(async () => {
            setLoading(true);
            await new Promise(resolve => setTimeout(resolve, 3000));
            const { error } = await supabase.from(tableId).insert(newDatas as any);
            if (error) throw Error(`L'ajout a échoué: ${error.message} !`);
            // const newDatasR: R = { ...newDatas, id: -1 } as R;
            // setDatas(datas => [ newDatasR, ...datas ]);
            console.log("add ", tableId, datas);
            setObsolet(true);
        });
    }, []);

    const update = React.useCallback(async (
        id: string | number,
        updatedDatas: Partial<R>,
    ) => {
        return manager(async () => {
            setLoading(true);
            await new Promise(resolve => setTimeout(resolve, 3000));
            const { error } = await supabase.from(tableId)
                .update(updatedDatas as any).eq('id', id);
            if (error) throw Error(`La modification a échoué: ${error.message} !`);
            // setDatas(datas => datas.filter(datas => ( datas.id === id ?
            //     { ...datas, ...updatedDatas } : datas) ));
            console.log("update", tableId, datas);
            setObsolet(true);
        });
    }, []);

    return { datas, obsolet, read, add, update };
}

