'use client'

import React from "react";
import { SupabaseContext, useSupabase } from "./useSupabase";
import { SupabaseSelect, SupabaseSlt } from "./useBook";
import { Id, TableId } from "../types";

export type ConfigType<T> = T & {
    id: string | Id,
    disabled: boolean,
}

export type Config<T extends Object> = SupabaseContext<ConfigType<T>> & {
    list: ConfigType<T>[];
}

export function useConfig<T extends Object>(
    tableId: TableId,
    filter?: (get: SupabaseSlt) => SupabaseSelect,
    listenTables: TableId[] = [],
): Config<T> {

    const mySupabase = useSupabase<ConfigType<T>>(tableId, filter, listenTables);

    const list = React.useMemo(() => {
        return mySupabase.datas
            .filter(data => !data.disabled);
    }, [mySupabase.datas]);

    return { ...mySupabase, list, };
}

