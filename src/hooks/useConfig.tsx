import React from "react";
import { CancelType } from "../types";
import Employer from "../types/employer";
import { DB, Key_String } from "../tools/database";

const tables = [
    'bedroom_table', 'bedroom_ctg_table', 'employer_table',
    'cleaning_book', 'customer_book', 'reservation_book', 'restaurant_book',
] as const;

export type TableId = typeof tables[number];

export type ConfigType<T> = T & {
    id: string,
    auth_session?: Employer.Id,
    last_update?: Date,
    description?: string,
    disabled?: CancelType,
}

export type Config<T extends Object> = {
    list: ConfigType<T>[];
    getId: (id: string) => ConfigType<T> | null,
    update: (id: string, data: Partial<ConfigType<T>>) => void;
}

export function useConfig<T extends { id: string }>(
    table: TableId,
    tableObj: Key_String<T>,
): Config<T> {
    const [datas, setDatas] = React.useState<ConfigType<T>[]>([]);

    React.useEffect(() => { // create table
        (async () => {
            await DB.createTable<T>(table, {
                ...tableObj, id: "TEXT PRIMARY KEY",
            });
            await readTable();
        })();
    }, []);

    const readTable = React.useCallback( // read table
        async (): Promise<ConfigType<T>[]
    > => {
        const stockedRows = await DB.readTable<ConfigType<T>>(table);
        setDatas(stockedRows);
        return stockedRows;
    }, []);

    const list = React.useMemo(() => {
        return datas.filter(data => !('disabled' in data));
    }, [datas]);

    const getId = React.useCallback((id: string) => {
        return datas.find(data => data.id === id) ?? null;
    }, [datas]);

    const update = React.useCallback(async (
        id: string,
        data: Omit<Partial<ConfigType<T>>,'id'>,
    ) => {
        await DB.update(table, id, { ...data }).then(readTable);
    }, []);

    return { list, getId, update, };
}

