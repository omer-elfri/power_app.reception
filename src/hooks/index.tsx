"use client";

import React from "react";
import { LocalBook, TypeWithTrace, useLocalData } from "./useBook";
import { Config, ConfigType, useConfig } from "./useConfig";

import { CleanProps, CleanType, CustomerType, ReservationType, RestaurantProps, RestaurantType } from "../types/types";
import BedRoom from "../types/bedroom";
import { supabase } from "../tools/supabase";

type DataContextType = {
    bedroom_table: Config<BedRoom.RoomData2>,
    bedroom_categories: ConfigType<BedRoom.Category.Type>[],

    cleaning_book: LocalBook<CleanProps, CleanType>,
    customer_book: LocalBook<CustomerType>,
    reservation_book: LocalBook<ReservationType>,
    restaurant_book: LocalBook<RestaurantProps, RestaurantType>,

    getBookedPeriod: (start?: Date, end?: Date | null) => TypeWithTrace<ReservationType>[],
    isBookedToday: (roomId: BedRoom.Id) => TypeWithTrace<ReservationType> | null,
};

export function DataProvider({ children }: {
    children: React.ReactNode
}) {
    const [today, setToday] = React.useState(new Date());

    React.useEffect(() => {
        const id = setInterval(() => {
            setToday( new Date() );
        }, 3*60*60*1000);
        return () => clearInterval(id);
    }, []);

    const bedroom_table = useConfig<BedRoom.RoomData2>('bedroom_table',
        table => table.select(`*,
            category:bedroom_ctg_table(*),
            lastClean:last_clean(*,
                valet:cleaning_valet(*))`)
            .is('disabled', false),
        [ 'bedroom_ctg_table', 'employer_table', 'cleaning_book' ]);

    const cleaning_book = useLocalData<CleanProps, CleanType>('cleaning_book',
        table => table.select(`*,
            valet:cleaning_valet(*)`),
        [ 'employer_table' ]);

    const customer_book = useLocalData<CustomerType>('customer_book',
        table => {
            const start = new Date(today); start.setHours(0, 0, 0, 0);
            const end = new Date(start); end.setDate(end.getDate() + 1);
            return table.select('*').or(`end.is.null,and(end.gte.${start.toISOString()},end.lt.${end.toISOString()})`)
        });

    const reservation_book = useLocalData<ReservationType>('reservation_book',
        table => {
            const start = new Date(today); start.setHours(0, 0, 0, 0);
            return table.select('*').or(`end_date.gte.${start.toISOString()}`);
        });

    const restaurant_book = useLocalData<RestaurantProps, RestaurantType>('restaurant_book',
        () => supabase.rpc('get_active_restaurants'),
        [ 'customer_book' ]);

    
    const bedroom_categories = React.useMemo(() => {
        return Array.from( new Map(
            bedroom_table.list.map(room =>
                [room.category_id, room.category])
        ).values() ).sort((a, b) => a.price - b.price);
    }, [bedroom_table.list]);



    const getBookedPeriod = React.useCallback((start?: Date, end?: Date | null) => {
        start ??= new Date();
        start.setHours(0, 0, 0, 0);
        end ??= new Date(start.getTime() + 24*60*60*1000);
        end.setHours(13, 0, 0, 0);
        return reservation_book.list.filter(rsv => rsv.start_date < end && start < rsv.end_date);
    }, [today, reservation_book.list]);

    const isBookedToday = React.useCallback((roomId: BedRoom.Id) => {
        const start = new Date();
        const comingToday = getBookedPeriod(start);
        return comingToday.find(rsv => rsv.room_id === roomId) ?? null;
    }, [getBookedPeriod]);


    return (
        <dataContext.Provider value={{
            bedroom_table,
            bedroom_categories,

            customer_book,
            cleaning_book,
            restaurant_book,
            reservation_book,

            isBookedToday,
            getBookedPeriod,
        }}>
            { children }
        </dataContext.Provider>
    );
}


const dataContext = React.createContext<DataContextType | null>(null);

export function useDataContext() {
    const context = React.useContext(dataContext);
    if (!context)
        throw new Error("useContext doit être utilisé dans ContextProvider");
    return context;
}

