"use client";

import React from "react";

import { useAuth } from './useAuth';
import { CheckInType, CleanType, NotificationId, NotificationType, ReservationType,
    RestaurantType, RoomType, State, StatusId, TypeWithTrace } from "../types";
import BedRoom from "../types/bedroom";
import { string_object } from "../tools";
import { roomIds } from "../configs/room";

type DataContextType = {
    customerBook: TypeWithTrace<CheckInType>[],
    cleaningBook: TypeWithTrace<CleanType>[],
    reservationBook: TypeWithTrace<ReservationType>[],
    restaurantBook: TypeWithTrace<RestaurantType>[],
    notificationBook: TypeWithTrace<NotificationType>[],

    restaurant: TypeWithTrace<RestaurantType>[],
    reservations: TypeWithTrace<ReservationType>[],
    todayBooked: Partial<Record<BedRoom.Id, TypeWithTrace<ReservationType>[]>>,
    lastCustomers: Partial<Record<BedRoom.Id, TypeWithTrace<CheckInType>>>,
    todayCustomers: Partial<Record<BedRoom.Id, TypeWithTrace<CheckInType>[]>>,
    lastCleaneds: Partial<Record<BedRoom.Id, TypeWithTrace<CleanType>>>,
    cleanings: Partial<Record<BedRoom.Id, TypeWithTrace<CleanType>[]>>,

    roomMap: Partial<Record<BedRoom.Id, RoomType>>,

    addCleaning: (roomId: BedRoom.Id, data: CleanType) => void,
    cancelCleaning: (id: number, description?: string) =>  void,
    addClientEvent: (roomId: BedRoom.Id, data: CheckInType) =>  void,
    addNotification: (roomId: BedRoom.Id, data: NotificationType) =>  void,
    addReservation: (roomId: BedRoom.Id, data: ReservationType) =>  void,
    cancelReservation: (id: number, description?: string) =>  void,

    getRestaurations: (roomId: BedRoom.Id) => TypeWithTrace<RestaurantType>[],
    getBookedPeriod: (dateStart?: Date, dateEnd?: Date | null) => TypeWithTrace<ReservationType>[],

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
    const { authSession, addTrace } = useAuth();
    const [customerBook, setCustomerBook] = React.useState<TypeWithTrace<CheckInType>[]>([]);
    const [cleaningBook, setCleaningBook] = React.useState<TypeWithTrace<CleanType>[]>([]);
    const [restaurantBook, setRestaurantBook] = React.useState<TypeWithTrace<RestaurantType>[]>([]);
    const [reservationBook, setReservationBook] = React.useState<TypeWithTrace<ReservationType>[]>([]);
    const [notificationBook, setNotificationBook] = React.useState<TypeWithTrace<NotificationType>[]>([]);
    const [roomsBook, setRoomsBook] = React.useState<RoomType[]>([]);

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

    const reservations = React.useMemo(() => {
        const today = new Date(Date.now());
        return reservationBook.filter(rsv => (
            !('cancel' in rsv) && (!rsv.end || rsv.end > today) ));
    }, [reservationBook]);

    const todayBooked: Partial<Record<BedRoom.Id, TypeWithTrace<ReservationType>[]>> = React.useMemo(() => {
        const today = new Date(Date.now());
        const comingToday = reservations.filter(rsv => rsv.start > today);
        return Object.groupBy(comingToday, rsv => rsv.roomId);
    }, [reservations]);

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
    }, [lastCustomers]);

    const restaurant = React.useMemo(() => {
        return restaurantBook.filter(resto => !resto.paid || todayCustomers[resto.roomId]);
    }, [restaurantBook, todayCustomers]);

    const lastCleaneds = React.useMemo(() => {
        const map: Partial<Record<BedRoom.Id, TypeWithTrace<CleanType>>> = {};
        let nbFound = 0;

        for (const cleaner of cleaningBook) {
            if (!map[cleaner.roomId]) {
                map[cleaner.roomId] = cleaner;
                if (++nbFound === roomIds.length) break;
            }
        }
        return map;
    }, [cleaningBook]);

    const cleanings = React.useMemo(() => {
        const res = cleaningBook.slice(0, 1000)
            .filter(elem => !('cancel' in elem) && !elem.end);
        return Object.groupBy(res, elem => elem.roomId);
    }, [cleaningBook]);


    const getRestaurations = React.useCallback((roomId: BedRoom.Id) => {
        return restaurant.filter(restauration => restauration.roomId === roomId) ?? null;
    }, [restaurant]);

    const getBookedPeriod = React.useCallback((
        dateStart?: Date, dateEnd?: Date | null
    ) => {
        return reservationBook.filter(rsv => {
            dateStart = dateStart ?? new Date(Date.now());
            dateEnd = dateEnd ?? new Date(dateStart.getTime() + 24*60*60*1000);
            return (rsv.start < dateStart && (!rsv.end || dateEnd < rsv.end));
        });
    }, [reservationBook]);


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
            if (index) throw new Error("Cette donnée est introuvable");
            list[index] = { ...list[index], ...data };
            return [...list];
        });
    }, []);

    return (
        <dataContext.Provider value={{
            customerBook,
            cleaningBook,
            reservationBook,
            restaurantBook,
            notificationBook,

            roomMap,
            restaurant,
            reservations,
            todayBooked,
            cleanings,
            lastCustomers,
            todayCustomers,
            lastCleaneds,
            getRestaurations,
            getBookedPeriod,

            addCleaning: React.useCallback((roomId: BedRoom.Id, data: CleanType) => {
                addToBook(roomId, data, setCleaningBook);
            }, [addToBook]),

            cancelCleaning: React.useCallback((id: number, description?: string) => {
                updateBook(id, { description, cancel: new Date(Date.now()) }, setCleaningBook);
            }, [addToBook]),

            addClientEvent: React.useCallback((roomId: BedRoom.Id, data: CheckInType) => {
                addToBook(roomId, data, setCustomerBook);
            }, [addToBook]),

            addNotification: React.useCallback((roomId: BedRoom.Id, data: NotificationType) => {
                addToBook(roomId, data, setNotificationBook);
            }, [addToBook]),

            addReservation: React.useCallback((roomId: BedRoom.Id, data: ReservationType) => {
                addToBook(roomId, data, setReservationBook);
            }, [addToBook]),

            cancelReservation: React.useCallback((id: number, description?: string) => {
                updateBook(id, {
                    description,
                    cancel: {
                        date: new Date(Date.now()),
                        auth_session: authSession?.id,
                    } }, setReservationBook);
            }, [addToBook, authSession]),

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
        localStorage.setItem(localKey, JSON.stringify(data));
    }, [data]);
}









