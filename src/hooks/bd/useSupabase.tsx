import React from "react";
import { supabase } from "../../tools/supabase";
import { SupabaseSelect } from "./useBook";
import { TableId } from "../../types";
import { parseDates } from "../../tools/date";
// import { useAuth } from "../useAuth";

export function useSupabase<T extends Object, R = T & { id: string | number}>(
    tableId: TableId,
    filter?: (supabase: SupabaseSelect) => SupabaseSelect,
    listenTables: TableId[] = [],
) {
    const [datas, setDatas] = React.useState<R[]>([]);
    // const { setLoading } = useAuth();
    filter ??= e => e;

    React.useEffect(() => { read() }, []);

    React.useEffect(() => {
        const channel = supabase
            .channel(`realtime-${tableId}`);
        [tableId, ...listenTables].forEach(tableId2 => {
            channel.on('postgres_changes', {
                event: '*',
                schema: 'public',
                table: tableId2,
            }, () => { void read(); })
        })
        channel.subscribe();

        return () => {
            void supabase.removeChannel(channel);
        };
    }, []);

    const read = React.useCallback(async (): Promise<R[]> => {
        try {
            console.log("get ", tableId);
            const { data, error } = await filter(
                supabase.from(tableId).select('*') );
            if (error) {
                console.log('error1', error.message);
                throw Error("Get à échoué !" + error.message);
            }
            const res = parseDates(data) as any[];
            setDatas(res);
            return res;
        } catch(err: any) {
            console.log('get err ', err.message)
            throw Error(err.message);
        }
        return [];
    }, [supabase]);

    const add = React.useCallback(async (datas: T) => {
        try {
            console.log("add ", tableId);
            // setLoading(true);
            await new Promise(resolve => setTimeout(resolve, 3000));
            const { error } = await supabase
                .from(tableId).insert(datas as any);
            if (error) {
                console.log('error1', error?.message);
                throw Error("L'ajout a échoué !");
            }
        } catch(err: any) {
            // setLoading(false);
            throw ['error', err.message];
        }
        // setLoading(false);
    }, [supabase]);

    const update = React.useCallback(async (
        id: string | number,
        data: Partial<R>,
        description?: string,
    ) => {
        try {
            console.log("update ", tableId);
            // setLoading(true);
            console.log('sending', data)
            const { data:data1, error } = await supabase.from(tableId)
                .update({ ...data, description, })
                .eq('id', id);
            if (error) {
                console.log('error1', error?.message);
                throw Error("La modification a échoué !");
            }
            console.log('data1', data1)
        } catch(err: any) {
            // setLoading(false);
            throw Error(err.message);
        }
        // setLoading(false);
    }, [supabase]);

    return { datas, setDatas, read, add, update }
}

