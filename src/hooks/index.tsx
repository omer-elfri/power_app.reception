"use client";

import React from "react";

import { useAuth } from './useAuth';
import { CleanType, CustomerType, PopupType, ReservationType,
    RestaurantType, RoomType, State, StatusId, TypeWithTrace } from "../types";
import Employer from "../types/employer";
import BedRoom from "../types/bedroom";
import { getDate, string_object } from "../tools";
import { roomIds } from "../configs/room";
import { employers_datas } from "../configs/employer";

type DataContextType = {
    customer_book: LocalBook<CustomerType>,
    cleaning_book: LocalBook<CleanType>,
    restaurant_book: LocalBook<RestaurantType>,
    reservation_book: LocalBook<ReservationType>,
    room_book: LocalBook<RoomType>,

    status: StatusId[], setStatus: State<StatusId[]>,
    alert: ["success" | "error", string] | null,
    setAlert: State<["success" | "error", string] | null>,

    popupList: PopupType[],
    addPopup: (pop: PopupType) => void,
    unPopup: () => void,


    reservations: TypeWithTrace<ReservationType>[],
    todayBooked: Partial<Record<BedRoom.Id, TypeWithTrace<ReservationType>[]>>,
    getBookedPeriod: (dateStart?: Date, dateEnd?: Date | null) => TypeWithTrace<ReservationType>[],

    customers: { [k: number]: TypeWithTrace<CustomerType> },
    todayCustomers: Partial<Record<BedRoom.Id, TypeWithTrace<CustomerType>[]>>,

    obsoletRooms: BedRoom.Id[],
    cleaners: (Employer.Type & {id: Employer.Id, rooms: TypeWithTrace<CleanType>[]})[],
    todayCleaned: TypeWithTrace<CleanType>[],
    cleanings: Partial<Record<BedRoom.Id, TypeWithTrace<CleanType>[]>>,
    getCleaningState: (roomId: BedRoom.Id) => string,

    restaurant: TypeWithTrace<RestaurantType>[],
};

export function DataProvider({ children }: {
    children: React.ReactNode
}) {
    const customer_book = useLocalData<CustomerType>('customer_book');
    const cleaning_book = useLocalData<CleanType>('cleaning_book');
    const restaurant_book = useLocalData<RestaurantType>('restaurant_book');
    const reservation_book = useLocalData<ReservationType>('reservation_book');
    const room_book = useLocalData<RoomType>('room_book');

    const [popupList, setPopupList] = React.useState<PopupType[]>([]);
    const [refresh, setRefresh] = React.useState(new Date(Date.now()));
    const [status, setStatus] = React.useState<StatusId[]>([]);
    const [alert, setAlert] = React.useState<['success' | 'error', string] | null>(null);

    React.useEffect(() => {
        const id = setInterval(() => {
            setRefresh( new Date(Date.now()) );
        }, 3*60*60*1000);
        return () => clearInterval(id);
    }, []);

    React.useEffect(() => {
        if (!alert) return;
        const id = setTimeout(() => setAlert(null), 3000);
        return () => clearTimeout(id);
    }, [alert]);








    const reservations = React.useMemo(() => {
        const today = new Date(Date.now());
        return reservation_book.get.filter(rsv => (
            !rsv.cancel && (!rsv.end || rsv.end > today) ));
    }, [refresh, reservation_book.get]);

    const getBookedPeriod = React.useCallback((
        dateStart?: Date, dateEnd?: Date | null
    ) => {
        return reservations.filter(rsv => {
            const start = new Date(dateStart ?? Date.now());
            start.setHours(0, 0, 0, 0);
            const end = dateEnd ?? new Date(start.getTime() + 24*60*60*1000);
            return ( rsv.start < end &&
                (!rsv.end || rsv.end > start)
            );
        });
    }, [reservations]);



    const todayBooked = React.useMemo(() => {
        const comingToday = getBookedPeriod();
        return Object.groupBy(comingToday, rsv => rsv.roomId);
    }, [getBookedPeriod]);

    const todayCustomers = React.useMemo(() => {
        const today = new Date(Date.now());
        const tab = Object.values(customer_book.lasts)
            .filter(customer => !customer.end || customer.end > today);
        return Object.groupBy(tab, elem => elem.roomId);
    }, [refresh, customer_book.lasts]);

    const todayCleaned = React.useMemo(() => {
        const today = new Date(Date.now());
        const res: TypeWithTrace<CleanType>[] = [];
        for (const clean of cleaning_book.get) {
            if ( getDate(clean.date) !== getDate(today) )
                break;
            res.unshift(clean);
        }
        return res;
    }, [refresh, cleaning_book.get]);




    const customers = React.useMemo(() => {
        const res: { [k: number]: TypeWithTrace<CustomerType> } = { };
        Object.values(todayCustomers)
            .forEach(([customer]) => {
                res[customer.id] = customer;
            });
        return res;
    }, [todayCustomers]);

    








    
    const obsoletRooms = React.useMemo(() => {
        const obsoletDay = new Date(Date.now() - 3*24*60*60*1000);
        return roomIds
            .filter(roomId => {
                const customer = customer_book.lasts[roomId];
                const cleaned = cleaning_book.lasts[roomId];
                if (!cleaned) return true;
                if (!cleaned.done) return false;
                if (cleaned.date < obsoletDay) return true;
                if (!customer) return false;
                if (customer.end && cleaned.done &&
                   cleaned.done < customer.end
                ) return true;
            } )
    }, [customer_book.lasts, cleaning_book.lasts]);

    const cleanings = React.useMemo(() => {
        const cleanings1 = cleaning_book.get
            .filter(elem => !elem.cancel && !elem.done);
        return Object.groupBy(cleanings1, elem => elem.roomId);
    }, [cleaning_book.get]);

    const cleaners = React.useMemo(() => {
        return Object.entries(employers_datas)
            .map(([id, employer]) => ({id, ...employer}))
            .filter(employer => {
                const rules = employer.rules as Employer.Rule[];
                return rules.includes(Employer.Rule.CLEANER);
            })
            .map(vallet => ({ ...vallet,
                rooms: todayCleaned.filter(clean =>
                    clean.valletId === vallet.id),
            })) as (Employer.Type & {
                id: Employer.Id,
                rooms: TypeWithTrace<CleanType>[],
            })[];
    }, [todayCleaned]);

    const getCleaningState = React.useCallback((roomId: BedRoom.Id) => {
        const lastCleaned = cleaning_book.lasts[roomId];
        if (!lastCleaned) return "...";

        const now = new Date(Date.now());
        const endDate = lastCleaned.done ?? null;
        if (!endDate) return lastCleaned.name;

        const res = endDate.getTime() - now.getTime() > 3*24*60*60*1000;
        return !res ? "Propre" : "Non";
    }, [cleaning_book.lasts]);









    const restaurant = React.useMemo(() => {
        return restaurant_book.get.filter(resto => {
            const customer = todayCustomers[resto.roomId]?.[0];
            return !resto.paid || (customer && customer.date < resto.date);
        } );
    }, [restaurant_book.get, todayCustomers]);








    return (
        <dataContext.Provider value={{
            customer_book,
            cleaning_book,
            restaurant_book,
            reservation_book,
            room_book,

            reservations,
            todayBooked,
            getBookedPeriod,

            obsoletRooms,
            cleaners,
            todayCleaned,
            cleanings,
            getCleaningState,

            customers,
            todayCustomers,

            restaurant,

            popupList,
            addPopup: React.useCallback((pop: PopupType) => {
                setPopupList(popupList => [ ...popupList, pop,]);
            }, []),
            unPopup: React.useCallback(() => {
                setPopupList(popupList => popupList.slice(0, popupList.length -1));
            }, []),
            status, setStatus,
            alert, setAlert,
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



export type LocalBook<T extends Object> = {
    get: TypeWithTrace<T>[];
    add: (roomId: BedRoom.Id, data: T, description?: string) => void;
    update: (id: number, data: Partial<TypeWithTrace<T>>, description?: string) => void;
    lasts: Partial<Record<BedRoom.Id, TypeWithTrace<T>>>;
}

export function useLocalData<T extends Object>(localKey: string): LocalBook<T> {
    const { addTrace } = useAuth();
    const [datas, setDatas] = React.useState<TypeWithTrace<T>[]>([]);

    React.useEffect(() => {
        const book = string_object<TypeWithTrace<T>[]>(localKey)
            ?.sort((a, b) => b.date.getTime() - a.date.getTime());
        if (book) setDatas(book);
    }, []);

    React.useEffect(() => {
        if (datas.length === 0) return;
        localStorage.setItem(localKey, JSON.stringify(datas));
    }, [datas]);

    const add = React.useCallback((
        roomId: BedRoom.Id, data: T,
        description?: string
    ) => {
        setDatas(list => {
            const id = list.length === 0 ? 0 : list[0].id + 1;
            const res = addTrace(id, roomId, data, description);
            return [res, ...list];
        });
    }, [addTrace]);

    const update = React.useCallback((
        id: number,
        data: Partial<TypeWithTrace<T>>,
        description?: string,
    ) => {
        setDatas(list => {
            const index = list.findIndex(elem => elem.id === id);
            if (index === -1) throw new Error("Cette donnée est introuvable");
            return list.map((elem, i) => (i === index)
                ? { ...elem, ...data, description } : elem);
        });
    }, []);

    const lasts = React.useMemo(() => {
        const list = datas.filter(data => !('cancel' in data) || !data.cancel);
        const res: Partial<Record<BedRoom.Id, TypeWithTrace<T> >> = { };

        for (const elem of list)
            if (!res[ elem.roomId ]) {
                res[ elem.roomId ] = elem;
                const nbRes = Object.values(res).length;
                if (roomIds.length === nbRes) break;
            }
        return res;
    }, [datas]);

    return { get: datas, add, update, lasts };
}
