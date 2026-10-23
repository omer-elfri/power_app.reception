"use client";

import React from "react";

import { State, TypeWithTrace, PopupType } from "../types";
import { CleanType, CustomerType, ReservationType, RestaurantType } from "../types/types";
import Employer from "../types/employer";
import BedRoom from "../types/bedroom";

import { LocalBook, useLocalData } from "./useBook";
import { Config, useConfig } from "./useConfig";
import { RoomData, room_list } from "../configs/room";
import { room_ctg_list } from "../configs/room_ctg";
import { employers_datas } from "../configs/employer";

type DataContextType = {
    bedroom_table: Config<RoomData>,
    bedroom_ctg_table: Config<BedRoom.Category.Type>,
    employer_table: Config<Employer.Type>,

    customer_book: LocalBook<CustomerType>,
    cleaning_book: LocalBook<CleanType>,
    restaurant_book: LocalBook<RestaurantType>,
    reservation_book: LocalBook<ReservationType>,

    alert: ["success" | "error", string] | null,
    setAlert: State<["success" | "error", string] | null>,
    checkError: (handler : () => any, message?: string) => void,

    receptionnists: Employer.Type[],
    cleaners: Employer.Type[],

    popupList: PopupType[],
    addPopup: (pop: PopupType) => void,
    switchPopup: (pop: PopupType) => void,
    unPopup: () => void,

    cleanings: TypeWithTrace<CleanType>[],
    customers: TypeWithTrace<CustomerType>[],
    reservations: TypeWithTrace<ReservationType>[],
    restaurant: TypeWithTrace<RestaurantType>[],





    getBookedPeriod: (start?: Date, end?: Date | null) => TypeWithTrace<ReservationType>[],
    isBookedToday: (roomId: BedRoom.Id) => TypeWithTrace<ReservationType> | null,

    isObsolet: (roomId: BedRoom.Id) => boolean,
    cleanerCleans: (Employer.Type & { rooms: TypeWithTrace<CleanType>[] })[],
};

export function DataProvider({ children }: {
    children: React.ReactNode
}) {
    const bedroom_table = useConfig<RoomData>('bedroom_table', room_list);
    const bedroom_ctg_table = useConfig<BedRoom.Category.Type>('bedroom_ctg_table', room_ctg_list);
    const employer_table = useConfig<Employer.Type>('employer_table', employers_datas);

    const customer_book = useLocalData<CustomerType>('customer_book');
    const cleaning_book = useLocalData<CleanType>('cleaning_book');
    const restaurant_book = useLocalData<RestaurantType>('restaurant_book');
    const reservation_book = useLocalData<ReservationType>('reservation_book');

    const [today, setToday] = React.useState(new Date(Date.now()));
    const [popupList, setPopupList] = React.useState<PopupType[]>([]);
    const [alert, setAlert] = React.useState<['success' | 'error', string] | null>(null);

    React.useEffect(() => {
        const id = setInterval(() => {
            setToday( new Date(Date.now()) );
        }, 3*60*60*1000);
        return () => clearInterval(id);
    }, []);

    const receptionnists: Employer.Type[] = React.useMemo(() => {
        return employer_table.list.filter(employer => (
            employer.rules as Employer.Rule[]).includes('RECEPTIONIST'));
    }, [employer_table]);

    const cleaners: Employer.Type[] = React.useMemo(() => {
        return employer_table.list.filter(employer => (
            employer.rules as Employer.Rule[]).includes('CLEANER'));
    }, [employer_table]);

    const checkError = React.useCallback((handler : () => any, message?: string) => {
        try {
            handler();
            if (message) setAlert(['success', message]);
        }
        catch (e) {
            setAlert(['error', e instanceof Error ? e.message : String(e)]);
        }
    }, []);

    const addPopup = React.useCallback((pop: PopupType) => {
        setPopupList(popupList => [ pop, ...popupList, ]);
    }, []);

    const unPopup = React.useCallback(() => {
        setPopupList(([_, ...popupList]) => popupList);
    }, []);

    const switchPopup = React.useCallback((pop: PopupType) => {
        unPopup(); addPopup(pop);
    }, [unPopup, addPopup]);






    const cleanings = React.useMemo(() => {
        return cleaning_book.get.filter(clean => !clean.done);
    }, [cleaners, cleaning_book.get]);

    const customers = React.useMemo(() => {
        return customer_book.get.filter(customer => !customer.end);
    }, [customer_book.get]);

    const reservations = React.useMemo(() => {
        return reservation_book.get.filter(rsv => rsv.end > today);
    }, [today, reservation_book.get]);

    const restaurant = React.useMemo(() => {
        return restaurant_book.get.filter(resto => {
            const customer = customer_book.get.find(customer => customer.id === resto.customerId);
            return !resto.paid || (customer && !customer.end);
        } );
    }, [restaurant_book.get, customer_book.get]);







    const getBookedPeriod = React.useCallback((start?: Date, end?: Date | null) => {
        start ??= today;
        start.setHours(0, 0, 0, 0);
        end ??= new Date(start.getTime() + 24*60*60*1000);
        end.setHours(0, 0, 0, 0);
        return reservations.filter(rsv => rsv.start < end && start < rsv.end);
    }, [today, reservations]);

    const isBookedToday = React.useCallback((roomId: BedRoom.Id) => {
        const comingToday = getBookedPeriod();
        return comingToday.find(rsv => rsv.roomId === roomId) ?? null;
    }, [getBookedPeriod]);

    const isObsolet = React.useCallback((roomId: BedRoom.Id) => {
        const obsoletDay = new Date(Date.now() - 3*24*60*60*1000);
        const cleaned = cleaning_book.get.find(clean => clean.roomId === roomId);
        const customer = customer_book.get.find(customer => customer.roomId === roomId);

        if (!cleaned) return true;
        if (!cleaned.done) return false;
        if (cleaned.done < obsoletDay) return true;
        if (customer?.end && cleaned.done < customer.end) return true;
        return false;
    }, [cleaning_book.get, customer_book.get]);



    const cleanerCleans = React.useMemo(() => {
        return cleaners.map(cleaner => ({ ...cleaner,
           rooms: cleanings.filter(clean => clean.valletId === cleaner.id),
       }))
    }, [cleaners, cleanings]);

























    return (
        <dataContext.Provider value={{
            bedroom_table,
            bedroom_ctg_table,
            employer_table,

            customer_book,
            cleaning_book,
            restaurant_book,
            reservation_book,

            receptionnists,
            cleaners,

            popupList, addPopup, switchPopup, unPopup,
            alert, setAlert, checkError,

            cleanings,
            customers,
            reservations,
            restaurant,



            isBookedToday,
            getBookedPeriod,

            isObsolet,
            cleanerCleans,
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

