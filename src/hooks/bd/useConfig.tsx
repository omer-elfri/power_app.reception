import React from "react";
import { State, TableId } from "../../types";
import { useSupabase } from "./useSupabase";
import { SupabaseSelect } from "./useBook";

export type ConfigType<T> = T & {
    id: string,
}

export type Config<T extends Object> = {
    list: ConfigType<T>[];
    set: State<ConfigType<T>[]>,
    getId: (id: string) => ConfigType<T> | null,
    update: (id: string, data: Partial<ConfigType<T>>) => void;
}

export function useConfig<T extends Object>(
    tableId: TableId,
    filter?: (get: SupabaseSelect) => SupabaseSelect,
    listenTables: TableId[] = [],
): Config<T> {
    const mySupabase = useSupabase<ConfigType<T>>(tableId, table => {
        return (filter ? filter(table) : table);
    }, listenTables);
    const { datas, setDatas } = mySupabase;//return (filter ? filter(select) : select)

    const getId = React.useCallback((id: string) => {
        return datas.find(data => data.id === id) ?? null;
    }, [datas]);

    const update = React.useCallback(async (
        id: string,
        data: Partial<ConfigType<T>>,
    ) => {
        await mySupabase.update(id, data);
    }, []);

    return {
        list: datas,
        set: setDatas,
        getId, update,
    };
}

