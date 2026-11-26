'use client'

import React from "react";
import { SupabaseContext, SupabaseObject, useSupabase } from "./useSupabase";
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
    others: SupabaseObject,
): Config<T> {

    const mySupabase = useSupabase<ConfigType<T>>(tableId, others);

    const list = React.useMemo(() => {
        return mySupabase.datas.filter(data => !data.disabled);
    }, [mySupabase.datas]);

    return { ...mySupabase, list, };
}

