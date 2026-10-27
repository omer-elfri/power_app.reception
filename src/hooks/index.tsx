"use client";

import React from "react";

import { PopupType } from "../types";
import { CleanType, CustomerType, ReservationType, RestaurantType } from "../types/types";
import Employer from "../types/employer";
import BedRoom from "../types/bedroom";

import { LocalBook, TypeWithTrace, useLocalData } from "./useBook";
import { Config, useConfig } from "./useConfig";
import { RoomData } from "../configs/room";
import { Infobulle } from "../components/Alert";
import { supabase } from "../tools/supabase";

type DataContextType = {
    bedroom_table: Config<RoomData>,
    bedroom_ctg_table: Config<BedRoom.Category.Type>,
    employer_table: Config<Employer.Type>,

    cleaning_book: LocalBook<CleanType>,
    customer_book: LocalBook<CustomerType>,
    reservation_book: LocalBook<ReservationType>,
    restaurant_book: LocalBook<RestaurantType>,

    alerts: Infobulle[],
    addAlert: (alert: Infobulle) => void,
    popAlert: () => void,
    checkError: (handler : () => void) => void,

    receptionnists: Employer.Type[],
    cleaners: Employer.Type[],
    getCleaner: (valletId?: string) => Employer.Type | null,

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
    const [today, setToday] = React.useState(new Date());
    const [popupList, setPopupList] = React.useState<PopupType[]>([]);
    const [alerts, setAlerts] = React.useState<Infobulle[]>([]);

    const bedroom_table = useConfig<RoomData>('bedroom_table', {
        'id': "TEXT NOT NULL",
        'name': "TEXT NOT NULL",
        'categories': "TEXT NOT NULL",
        'stage': "TEXT NOT NULL",
        'issue': "TEXT"
    });
    const bedroom_ctg_table = useConfig<BedRoom.Category.Type>('bedroom_ctg_table', {
        'id': "TEXT NOT NULL",
        'name': "TEXT NOT NULL",
        'price': "REAL NOT NULL",
        'option': "TEXT NOT NULL CHECK (option IN ('VENT', 'CLIM'))"
    });
    const employer_table = useConfig<Employer.Type>('employer_table', {
        'id': "TEXT NOT NULL",
        'sexe': "TEXT NOT NULL",
        'name': "TEXT NOT NULL",
        'pass': "TEXT NOT NULL",
        'rules': "TEXT NOT NULL"
    });

    const cleaning_book = useLocalData<CleanType>('cleaning_book', {
        valletId: "TEXT NOT NULL",
        done: "TEXT",
        cancel: "TEXT",
    });
    const customer_book = useLocalData<CustomerType>('customer_book', {
        sexe: "TEXT",
        name: "TEXT NOT NULL",
        tel: "INTEGER",
        town: "TEXT",
        price: "INTEGER NOT NULL",
        end: "TEXT",
        enterprise: "TEXT",
        ifu: "INTEGER",
        actions: "TEXT NOT NULL",
    });
    const reservation_book = useLocalData<ReservationType>('reservation_book', {
        name: "TEXT NOT NULL",
        start: "TEXT NOT NULL",
        end: "TEXT NOT NULL",
        cancel: "TEXT",
    });
    const restaurant_book = useLocalData<RestaurantType>('restaurant_book', {
        customerId: "TEXT NOT NULL",
        time: "TEXT NOT NULL",
        client: "TEXT NOT NULL",
        article: "TEXT NOT NULL",
        price: "INTEGER NOT NULL",
        paid: "INTEGER NOT NULL",
        cancel: "TEXT",
    });

    const addAlert = React.useCallback((alert: Infobulle) => {
        setAlerts(alerts => [ alert, ...alerts ]);
    }, []);

    const popAlert = React.useCallback(() => {
        setAlerts(([_, ...alerts]) => alerts);
    }, []);

    React.useEffect(() => {
        const id = setInterval(() => {
            setToday( new Date() );
        }, 3*60*60*1000);
        return () => clearInterval(id);
    }, []);

    React.useEffect(() => {
        supabase;
    }, [today]);

    const receptionnists: Employer.Type[] = React.useMemo(() => {
        return employer_table.list.filter(employer => (
            employer.rules as Employer.Rule[]).includes('RECEPTIONIST'));
    }, [employer_table]);

    const cleaners: Employer.Type[] = React.useMemo(() => {
        return employer_table.list.filter(employer => (
            employer.rules as Employer.Rule[]).includes('CLEANER'));
    }, [employer_table]);

    const getCleaner = React.useCallback((valletId?: Employer.Id) => {
        return cleaners.find(cleaner => cleaner.id === valletId) ?? null;
    }, [cleaners]);

    const checkError = React.useCallback((handler : () => void) => {
        try { handler(); }
        catch (alert) {
            addAlert(alert as Infobulle);
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
        const cleaned = cleaning_book.getRoomId(roomId);
        const customer = customer_book.getRoomId(roomId);

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
            getCleaner,

            popupList, addPopup, switchPopup, unPopup,
            alerts, addAlert, popAlert, checkError,

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

