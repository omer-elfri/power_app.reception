"use client";

import React from "react";

import { PopupType } from "../types";
import { CleanProps, CleanType, CustomerType, ReservationType, RestaurantProps, RestaurantType } from "../types/types";
import Employer from "../types/employer";
import BedRoom from "../types/bedroom";

import { LocalBook, TypeWithTrace, useLocalData } from "./bd/useBook";
import { Config, ConfigType, useConfig } from "./bd/useConfig";
import { Infobulle } from "../components/Alert";
import { useAuth } from "./useAuth";

type DataContextType = {
    bedroom_table: Config<BedRoom.RoomData2>,
    bedroom_categories: ConfigType<BedRoom.Category.Type>[],

    cleaning_book: LocalBook<CleanProps, CleanType>,
    customer_book: LocalBook<CustomerType>,
    reservation_book: LocalBook<ReservationType>,
    restaurant_book: LocalBook<RestaurantProps, RestaurantType>,

    alerts: Infobulle[],
    addAlert: (alert: Infobulle) => void,
    popAlert: () => void,
    checkError: (handler : () => Promise<void>) => void,

    popupList: PopupType[],
    addPopup: (pop: PopupType) => void,
    switchPopup: (pop: PopupType) => void,
    unPopup: () => void,



    getCleaner: (valetId?: Employer.Id) => Employer.Type | null,

    getBookedPeriod: (start?: Date, end?: Date | null) => TypeWithTrace<ReservationType>[],
    isBookedToday: (roomId: BedRoom.Id) => TypeWithTrace<ReservationType> | null,

    isObsolet: (roomId: BedRoom.Id) => boolean,
    cleanerCleans: (Employer.Type & { rooms: TypeWithTrace<CleanType>[] })[],
};

export function DataProvider({ children }: {
    children: React.ReactNode
}) {
    const { cleaners, } = useAuth();
    const [today, setToday] = React.useState(new Date());
    const [popupList, setPopupList] = React.useState<PopupType[]>([]);
    const [alerts, setAlerts] = React.useState<Infobulle[]>([]);

    const bedroom_table = useConfig<BedRoom.RoomData2>('bedroom_table', select => {
        return select.select(`*, category:bedroom_ctg_table(*), lastClean:last_clean(*)`);
    }, [ 'bedroom_ctg_table', 'cleaning_book' ]);
    const cleaning_book = useLocalData<CleanProps, CleanType>('cleaning_book', select => {
        return select.select(`*, valet:cleaning_valet(*)`);
    }, [ 'cleaning_book' ]);
    const customer_book = useLocalData<CustomerType>('customer_book');
    const reservation_book = useLocalData<ReservationType>('reservation_book');
    const restaurant_book = useLocalData<RestaurantProps, RestaurantType>('restaurant_book', select => {
        return select.select(`*, customer:restaurant_customer(*)`);
    }, [ 'customer_book' ]);

    
    React.useEffect(() => {
        const id = setInterval(() => {
            setToday( new Date() );
        }, 3*60*60*1000);
        return () => clearInterval(id);
    }, []);


    const addAlert = React.useCallback((alert: Infobulle) => {
        setAlerts(alerts => [ alert, ...alerts ]);
    }, []);

    const popAlert = React.useCallback(() => {
        setAlerts(([_, ...alerts]) => alerts);
    }, []);

    const addPopup = React.useCallback((pop: PopupType) => {
        setPopupList(popupList => [ pop, ...popupList, ]);
    }, []);

    const switchPopup = React.useCallback((pop: PopupType) => {
        unPopup(); addPopup(pop);
    }, []);

    const unPopup = React.useCallback(() => {
        setPopupList(([_, ...popupList]) => popupList);
    }, []);




    const bedroom_categories = React.useMemo(() => {
        return Array.from( new Map(
            bedroom_table.list.map(room =>
                [room.category_id, room.category])
        ).values() ).sort((a, b) => a.price - b.price);
    }, [bedroom_table.list]);



    const getCleaner = React.useCallback((valetId?: Employer.Id) => {
        return cleaners.find(cleaner => cleaner.id === valetId) ?? null;
    }, [cleaners]);

    const checkError = React.useCallback(async (handler : () => Promise<void>) => {
        try { await handler(); }
        catch (alert) {
            addAlert(alert as Infobulle);
        }
    }, []);

    const getBookedPeriod = React.useCallback((start?: Date, end?: Date | null) => {
        start ??= today;
        start.setHours(0, 0, 0, 0);
        end ??= new Date(start.getTime() + 24*60*60*1000);
        end.setHours(0, 0, 0, 0);
        return reservation_book.list.filter(rsv => rsv.start_date < end && start < rsv.end_date);
    }, [today, reservation_book.list]);

    const isBookedToday = React.useCallback((roomId: BedRoom.Id) => {
        const comingToday = getBookedPeriod();
        return comingToday.find(rsv => rsv.room_id === roomId) ?? null;
    }, [getBookedPeriod]);

    const isObsolet = React.useCallback((roomId: BedRoom.Id) => {
        const obsoletDay = new Date(Date.now() - 3*24*60*60*1000);
        const cleaned = bedroom_table.getId(roomId)?.lastClean;
        const customer = customer_book.getRoomId(roomId);

        if (!cleaned) return true;
        if (!cleaned.done) return false;
        if (cleaned.done < obsoletDay) return true;
        if (customer?.end && cleaned.done < customer.end) return true;
        return false;
    }, [bedroom_table, customer_book]);

    const cleanerCleans = React.useMemo(() => {
        return cleaners.map(cleaner => ({ ...cleaner,
           rooms: cleaning_book.list.filter(clean => clean.valet_id === cleaner.id),
       }))
    }, [cleaners, cleaning_book.list]);



    return (
        <dataContext.Provider value={{
            bedroom_table,
            bedroom_categories,

            customer_book,
            cleaning_book,
            restaurant_book,
            reservation_book,

            getCleaner,

            popupList, addPopup, switchPopup, unPopup,
            alerts, addAlert, popAlert, checkError,

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

