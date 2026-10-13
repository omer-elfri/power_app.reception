"use client";

import React from "react";

import { useAuth } from './useAuth';
import { CheckInType, CleanType, NotificationType, ReservationType,
    RestaurantType, RoomType, State, StatusId, TypeWithTrace } from "../types";
import BedRoom from "../types/bedroom";
import { getDate, string_object } from "../tools";
import { roomIds } from "../configs/room";
import Employer from "../types/employer";
import { employers_datas } from "../configs/employer";

type DataContextType = {
    roomMap: Partial<Record<BedRoom.Id, RoomType>>,
    customerBook: TypeWithTrace<CheckInType>[],
    cleaningBook: TypeWithTrace<CleanType>[],
    reservationBook: TypeWithTrace<ReservationType>[],
    restaurantBook: TypeWithTrace<RestaurantType>[],
    notificationBook: TypeWithTrace<NotificationType>[],

    setCustomerBook: State<TypeWithTrace<CheckInType>[]>,
    setCleaningBook: State<TypeWithTrace<CleanType>[]>,
    setReservationBook: State<TypeWithTrace<ReservationType>[]>,

    addToBook: <T extends Object>(roomId: BedRoom.Id, data: T, setter: State<TypeWithTrace<T>[]>) => void,
    updateBook: <T extends Object>(id: number, data: Partial<T>, setter: State<TypeWithTrace<T>[]>) => void,



    reservations: TypeWithTrace<ReservationType>[],
    todayBooked: Partial<Record<BedRoom.Id, TypeWithTrace<ReservationType>[]>>,
    getBookedPeriod: (dateStart?: Date, dateEnd?: Date | null) => TypeWithTrace<ReservationType>[],

    lastCustomers: Partial<Record<BedRoom.Id, TypeWithTrace<CheckInType>>>,
    todayCustomers: Partial<Record<BedRoom.Id, TypeWithTrace<CheckInType>[]>>,

    obsoletRooms: BedRoom.Id[],
    cleaners: (Employer.Type & {id: Employer.Id, rooms: TypeWithTrace<CleanType>[]})[],
    cleanedToday: TypeWithTrace<CleanType>[],
    lastCleaneds: Partial<Record<BedRoom.Id, TypeWithTrace<CleanType>>>,
    cleanings: Partial<Record<BedRoom.Id, TypeWithTrace<CleanType>[]>>,

    restaurant: TypeWithTrace<RestaurantType>[],
    getRestaurations: (roomId: BedRoom.Id) => TypeWithTrace<RestaurantType>[],

    addNotification: (roomId: BedRoom.Id, data: NotificationType) =>  void,

    status: StatusId[],
    setStatus: State<StatusId[]>,
    roomPopup: BedRoom.Id | null,
    setRoomPopup: State<BedRoom.Id | null>,
    cleaningPopup: boolean,
    setCleaningPopup: State<boolean>,
    bookingPopup: boolean,
    setBookingPopup: State<boolean>,
};

export function DataProvider({ children }: { children: React.ReactNode }) {
    const { addTrace } = useAuth();
    const [customerBook, setCustomerBook] = React.useState<TypeWithTrace<CheckInType>[]>([]);
    const [cleaningBook, setCleaningBook] = React.useState<TypeWithTrace<CleanType>[]>([]);
    const [restaurantBook, setRestaurantBook] = React.useState<TypeWithTrace<RestaurantType>[]>([]);
    const [reservationBook, setReservationBook] = React.useState<TypeWithTrace<ReservationType>[]>([]);
    const [notificationBook, setNotificationBook] = React.useState<TypeWithTrace<NotificationType>[]>([]);
    const [roomsBook, setRoomsBook] = React.useState<RoomType[]>([]);

    const [refresh, setRefresh] = React.useState(new Date(Date.now()));
    const [status, setStatus] = React.useState<StatusId[]>([]);
    const [roomPopup, setRoomPopup] = React.useState<BedRoom.Id | null>(null);
    const [cleaningPopup, setCleaningPopup] = React.useState(false);
    const [bookingPopup, setBookingPopup] = React.useState(false);

    useLocalData('cleaning_book', cleaningBook, setCleaningBook);
    useLocalData('customer_book', customerBook, setCustomerBook);
    useLocalData('reservation_book', reservationBook, setReservationBook);
    useLocalData('restaurant_book', restaurantBook, setRestaurantBook);
    useLocalData('notification_book', notificationBook, setNotificationBook);
    useLocalData('room_book', roomsBook, setRoomsBook);

    const roomMap = React.useMemo(() => {
        return Object.fromEntries( roomsBook.map(elem => [elem.roomId, elem]) ) as
            Partial<Record<BedRoom.Id, RoomType>>;
    }, [roomsBook]);


    React.useEffect(() => {
        setInterval(() => {
            setRefresh( new Date(Date.now()) );
        }, 3*60*60*1000);
    }, []);





    const reservations = React.useMemo(() => {
        const today = new Date(Date.now());
        return reservationBook.filter(rsv => (
            !('cancel' in rsv) && (!rsv.end || rsv.end > today) ));
    }, [refresh, reservationBook]);

    const getBookedPeriod = React.useCallback((
        dateStart?: Date, dateEnd?: Date | null
    ) => {
        return reservations.filter(rsv => {
            const start = new Date(dateStart ?? Date.now());
            start.setHours(0, 0, 0, 0);
            const end = dateEnd ?? new Date(start.getTime() + 24*60*60*1000);
            return (
                (rsv.start < end) &&
                (!rsv.end || rsv.end > start)
            );
        });
    }, [reservations]);

    const todayBooked = React.useMemo(() => {
        const comingToday = getBookedPeriod();
        console.log("comingToday", comingToday);
        return Object.groupBy(comingToday, rsv => rsv.roomId);
    }, [getBookedPeriod]);




    const lastCustomers = React.useMemo(() => {
        const map: Partial<Record<BedRoom.Id, TypeWithTrace<CheckInType>>> = {};
        let nbFound = 0;

        for (const customer of customerBook) {
            if (!map[customer.roomId]) {
                map[customer.roomId] = customer;
                if (++nbFound === roomIds.length) break;
            }
        }
        return map;
    }, [customerBook]);

    const todayCustomers = React.useMemo(() => {
        const today = new Date(Date.now());
        const tab = Object.values(lastCustomers)
            .filter(customer => !customer.end || customer.end > today);
        return Object.groupBy(tab, elem => elem.roomId);
    }, [refresh, lastCustomers]);







    const lastCleaneds = React.useMemo(() => {
        const map: Partial<Record<BedRoom.Id, TypeWithTrace<CleanType>>> = {};
        let nbFound = 0;

        for (const cleaner of cleaningBook) {
            if (!map[cleaner.roomId] && !('cancel' in cleaner)) {
                map[cleaner.roomId] = cleaner;
                if (++nbFound === roomIds.length) break;
            }
        }
        return map;
    }, [cleaningBook]);

    const obsoletRooms = React.useMemo(() => {
        const obsoletDay = new Date(Date.now() - 3*24*60*60*1000);
        return roomIds
            .filter(roomId => !lastCleaneds[roomId] ||
                lastCleaneds[roomId].date < obsoletDay);
    }, [lastCleaneds]);

    const cleanings = React.useMemo(() => {
        const cleanings1 = cleaningBook
            .filter(elem => !('cancel' in elem) && !elem.done);
        return Object.groupBy(cleanings1, elem => elem.roomId);
    }, [cleaningBook]);

    const cleanedToday = React.useMemo(() => {
        const res: TypeWithTrace<CleanType>[] = [];
        const today = new Date(Date.now());
        for (const clean of cleaningBook) {
            if ( getDate(clean.date) !== getDate(today) )
                break;
            res.unshift(clean);
        }
        return res;
    }, [refresh, cleaningBook]);

    const cleaners = React.useMemo(() => {
        return Object.entries(employers_datas)
            .map(([id, employer]) => ({id, ...employer}))
            .filter(employer => {
                const rules = employer.rules as Employer.Rule[];
                return rules.includes(Employer.Rule.CLEANER);
            })
            .map(vallet => ({ ...vallet,
                rooms: cleanedToday.filter(clean =>
                    clean.valletId === vallet.id),
            })) as
            (Employer.Type & {id: Employer.Id, rooms: TypeWithTrace<CleanType>[]})[];
    }, [cleanedToday]);







    const restaurant = React.useMemo(() => {
        return restaurantBook.filter(resto => !resto.paid || todayCustomers[resto.roomId]);
    }, [restaurantBook, todayCustomers]);

    const getRestaurations = React.useCallback((roomId: BedRoom.Id) => {
        return restaurant.filter(restauration => restauration.roomId === roomId) ?? null;
    }, [restaurant]);








    const addToBook = React.useCallback(<T extends Object>(
        roomId: BedRoom.Id, data: T, setter: State<TypeWithTrace<T>[]>
    ) => {
        setter(list => {
            const id = list.length === 0 ? 0 : list[0].id + 1;
            const res = addTrace(id, roomId, data);
            return [res, ...list];
        });
    }, [addTrace]);

    const updateBook = React.useCallback(<T extends Object>(
        id: number, data: Partial<T>, setter: State<TypeWithTrace<T>[]>
    ) => {
        setter(list => {
            const index = list.findIndex(elem => elem.id === id);
            if (index === -1) throw new Error("Cette donnée est introuvable");
            return list.map((elem, i) => (i === index) ? { ...elem, ...data } : elem);
        });
    }, []);

    return (
        <dataContext.Provider value={{
            roomMap,
            customerBook,
            cleaningBook,
            reservationBook,
            restaurantBook,
            notificationBook,

            addToBook, updateBook,
            setCustomerBook,
            setCleaningBook,
            setReservationBook,

            reservations,
            todayBooked,
            getBookedPeriod,

            obsoletRooms,
            cleaners,
            cleanedToday,
            cleanings,
            lastCleaneds,

            lastCustomers,
            todayCustomers,

            restaurant,
            getRestaurations,

            addNotification: React.useCallback((
                roomId: BedRoom.Id,
                data: NotificationType,
            ) => {
                addToBook(roomId, data, setNotificationBook);
            }, [addToBook]),

            status, setStatus,
            roomPopup, setRoomPopup,
            cleaningPopup, setCleaningPopup,
            bookingPopup, setBookingPopup,
        }}> { children }
        </dataContext.Provider>
    );
}



export type CheckInProps = {
    sexe?: "Mr" | "Mme";
    clientName: string;
    price: number;
    description?: string;
    night?: number;
}

const dataContext = React.createContext<DataContextType | null>(null);

export function useDataContext() {
    const context = React.useContext(dataContext);
    if (!context)
        throw new Error("useContext doit être utilisé dans ContextProvider");
    return context;
}


export function useLocalData<T extends Object>(localKey: string, data: T[], setter: (dtas: T[]) => void) {

    React.useEffect(() => {
        const book = string_object<T[]>(localKey);
        if (book) setter(book);
    }, []);

    React.useEffect(() => {
        if (data.length === 0) return;
        localStorage.setItem(localKey, JSON.stringify(data));
    }, [data]);
}
