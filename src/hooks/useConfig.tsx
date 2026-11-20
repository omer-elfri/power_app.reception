import React from "react";
import { useSupabase } from "./useSupabase";
import { SupabaseSelect, SupabaseSlt } from "./useBook";
import { Id, TableId } from "../types";

export type ConfigType<T> = T & {
    id: string | Id,
    disabled: boolean,
}

export type Config<T extends Object> = {
    list: ConfigType<T>[];
    read: () => Promise<(T & { id: string | number })[]>,
    getId: (id: string | Id) => ConfigType<T> | null;
    update: (id: string | Id, data: Partial<ConfigType<T>>) => Promise<void>;
}

export function useConfig<T extends Object>(
    tableId: TableId,
    filter?: (get: SupabaseSlt) => SupabaseSelect,
    listenTables: TableId[] = [],
): Config<T> {
    const mySupabase = useSupabase<ConfigType<T>>(
        tableId, filter, listenTables);
    // console.log(tableId, mySupabase.datas)
    const datas = mySupabase.datas//.filter(data => !data.disabled) as ConfigType<T>[];

    const getId = React.useCallback((id: string | Id) => {
        return datas.find(data => data.id === id) ?? null;
    }, [datas]);

    return {
        list: datas,
        read: mySupabase.read,
        getId,
        update: mySupabase.update,
    };
}

