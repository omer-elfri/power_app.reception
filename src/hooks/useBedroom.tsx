"use client";
import React from "react";

import { useAuth } from "./useAuth";
import { useDataContext } from ".";

import { room_datas, roomIds } from "../configs/room";
import { CheckInType, CustomerType, ReservationType, TypeWithTrace, PriorityId } from "../types";
import Employer from "../types/employer";
import BedRoom from "../types/bedroom";
import { getFrenchDate, toTab } from "../tools";

export type CheckInProps = Omit<CheckInType, 'status' | 'start' | 'end'> & { night: number };

export type BedRoomContext = {
    bedRooms: BedRoom.Map,
    bedRoomTab: BedRoom.Type[],

    switch_power: (roomId: BedRoom.Id, power: boolean | null) => void,
    updateIssue: (roomId: BedRoom.Id, priority: PriorityId, message: string) => void,

    check_in: (roomId: BedRoom.Id, props: Omit<CustomerType, 'actions'>, description?: string) => void,
    check_update: (customerId: number, props: Partial<CustomerType>, description?: string) => void,
    check_move: (customerId: number, roomIdB: BedRoom.Id, description?: string) => void,
    check_out: (customerId: number, description?: string) => void,

    clean_room: (roomId: BedRoom.Id, valletId: Employer.Id, description?: string) => void,
    done_cleaning: (roomId: BedRoom.Id, description?: string) => void,
    cancel_cleaning: (roomId: BedRoom.Id, description?: string) => void,

    book: (roomId: BedRoom.Id, props: ReservationType, description?: string) => void,
    cancel_book: (bookId: number, description?: string) => void,
}

export function BedRoomProvider({ children }: { children: React.ReactNode }) {
    const { authSession } = useAuth();
    const { 
        customer_book, cleaning_book, reservation_book, room_book,
        todayCustomers, todayBooked, getBookedPeriod,
        cleanings, customers, restaurant, reservations,
    } = useDataContext();

    const [bedRooms, setBedRooms] = React.useState(
        Object.fromEntries( roomIds.map(roomId => [
            roomId, {
                ...room_datas[roomId],
                id: roomId,
                connected: false,
                power: false,
                customer: null,
                booked: null,
                cleaner: null,
                restauration: [],
                issue: null,
            } as BedRoom.Type
        ]) ) as BedRoom.Map );

    const bedRoomTab = React.useMemo<BedRoom.Type[]>(() => {
        return toTab(bedRooms)
            .sort( (a, b) => parseInt(a.id) - parseInt(b.id) );
    }, [bedRooms]);

    const updateBedRoom = React.useCallback((
        roomId: BedRoom.Id,
        props: Partial<BedRoom.Type>,
    ) => {
        setBedRooms(datas => {
            const oldRoom = datas[roomId];
            const newRoom = { ...oldRoom, ...props, };
            return { ...datas, [roomId]: newRoom };
        });
    }, []);

    React.useEffect(() => {
        setBedRooms(bedRooms => {
            return Object.fromEntries( roomIds.map(roomId => {
                const { connected, power } = bedRooms[roomId];
                const res = {
                    ...room_datas[roomId],
                    id: roomId, connected, power,
                    customer: todayCustomers[roomId]?.[0] ?? null,
                    booked: todayBooked[roomId]?.[0] ?? null,
                    cleaner: cleanings[roomId]?.[0] ?? null,
                    restauration: restaurant.filter(resto => resto.roomId === roomId),
                    issue: room_book.lasts[roomId]?.issue ?? null,
                }
                return [ roomId, res ];
            }) ) as BedRoom.Map;
        })
    }, [room_book.lasts, todayCustomers, todayBooked, cleanings, restaurant]);



    const switch_power = React.useCallback((roomId: BedRoom.Id, power: boolean | null) => {
        if (power === null) {
            updateBedRoom(roomId, { connected: false});
        } else {
            updateBedRoom(roomId, { connected: true, power });
        }
    }, [updateBedRoom]);

    const updateIssue = React.useCallback((roomId: BedRoom.Id, priority: PriorityId, message: string) => {
        room_book.add(roomId, { roomId, issue: { priority, message } });
    }, [bedRooms, room_book.add]);


    const check_in = React.useCallback((roomId: BedRoom.Id, customer: Omit<CustomerType, 'actions'>, description?: string) => {
        const room = bedRooms[roomId];
        if (room.customer)
            throw Error(`La chambre ${roomId} est déja en check in`);
        const action: CheckInType = { status: 'CHECK_IN', roomId,
            datas: { customer }, date: new Date(Date.now()) };
        const res: CustomerType = {...customer, actions: [action]}
        customer_book.add(roomId, res, description);
    }, [bedRooms, customer_book.add]);

    const check_update = React.useCallback((customerId: number, props: Partial<CustomerType>, description?: string) => {
        const customer = customers[customerId];
        if (!customer) throw Error(`Le client est introuvable`);

        const action: CheckInType = { status: 'CHECK_UPDATE', roomId: customer.roomId,
            datas: props, date: new Date(Date.now()) };
        const res: Partial<CustomerType> = { ...props, actions: [...customer.actions, action] }
        customer_book.update(customerId, res, description);
    }, [customers, customer_book.update]);

    const check_move = React.useCallback((customerId: number, toRoomId: BedRoom.Id, description?: string) => {
        const customer = customers[customerId];
        if (!customer)
            throw Error(`Le client est introuvable`);
        if (bedRooms[toRoomId].customer)
            throw Error(`La chambre cible ${toRoomId} est en check in`);

        const action: CheckInType = { status: 'CHECK_MOVE', roomId: toRoomId,
            datas: { fromRoomId: customer.roomId }, date: new Date(Date.now()) };
        const res: Partial<TypeWithTrace<CustomerType>> = { roomId: toRoomId, actions: [...customer.actions, action]}
        customer_book.update(customerId, res, description);
    }, [customers, customer_book.update, bedRooms]);

    const check_out = React.useCallback((customerId: number, description?: string) => {
        const customer = customers[customerId];
        if (!customer) throw Error(`Le client est introuvable`);

        const toPay = restaurant
            .filter(resto => resto.customerId === customerId && !resto.paid)
            .reduce((res, food) => res + food.price, 0);
        if (toPay) alert(
            `Le client ${customer.name} de la chambre ${customer.roomId} doit solder ${toPay} au restaurant`);
        const action: CheckInType = { status: 'CHECK_OUT', roomId: customer.roomId, date: new Date(Date.now()) };
        const res: Partial<CustomerType> = { actions: [...customer.actions, action], end: new Date(Date.now())}
        customer_book.update(customerId, res, description);
    }, [customers, customer_book.update, restaurant]);


    const clean_room = React.useCallback((roomId: BedRoom.Id, valletId: Employer.Id, description?: string) => {
        const room = bedRooms[roomId];
        if ( room.cleaner )
            throw Error(`La chambre ${roomId} est déjà en nettoyage`);
        cleaning_book.add(roomId, { valletId, }, description);
    }, [bedRooms, cleaning_book.add]);
    
    const done_cleaning = React.useCallback((roomId: BedRoom.Id, description?: string) => {
        const room = bedRooms[roomId];
        if ( !room.cleaner )
            throw Error(`La chambre ${roomId} n'est pas en nettoyage`);
        cleaning_book.update(room.cleaner.id, { done: new Date(Date.now()) }, description);
    }, [bedRooms, cleaning_book.update]);

    const cancel_cleaning = React.useCallback((roomId: BedRoom.Id, description?: string) => {
        const room = bedRooms[roomId];
        if ( !room.cleaner )
            throw Error(`La chambre ${roomId} n'est pas en nettoyage`);
        cleaning_book.update(room.cleaner.id, { cancel: new Date(Date.now()) }, description);
    }, [bedRooms, cleaning_book.update]);


    const book = React.useCallback((roomId: BedRoom.Id, props: ReservationType, description?: string) => {
        const bookedInPeriod = getBookedPeriod(props.start, props.end);
        const isBooked = bookedInPeriod.find(booked => booked.roomId === roomId);

        if (isBooked) throw Error(
            `La chambre ${roomId} à déjà été réservée par \
            ${isBooked.name.toUpperCase()} du ${getFrenchDate(isBooked.start)} au \
            ${isBooked.end ? getFrenchDate(isBooked.end) : '...'}`
        );
        const datas = { ...props, description };
        reservation_book.add(roomId, datas, description);
    }, [bedRooms, reservation_book.add, getBookedPeriod]);

    const cancel_book = React.useCallback((bookId: number, description?: string) => {
        const room_rsv = reservations.find(rsv => rsv.id === bookId);
        if (!room_rsv) throw Error("Réservation introuvable");
        if (!authSession) throw Error("Vous devez être connecté");
        const datas = { ...room_rsv, description,
            cancel: {
                date: new Date(Date.now()),
                auth_session: authSession.id,
            } };
        reservation_book.update(bookId, datas, description);
    }, [authSession, reservations, reservation_book.update]);



    return (
        <bedRoomContext.Provider value={{
            bedRooms, bedRoomTab,
            switch_power, updateIssue,
            check_in, check_update, check_move, check_out,
            clean_room, done_cleaning, cancel_cleaning,
            book, cancel_book,

        }}> { children }
        </bedRoomContext.Provider>
    );
}




const bedRoomContext = React.createContext<BedRoomContext | null>(null);

export function useBedroom() {
    const context = React.useContext(bedRoomContext);
    if (!context)
        throw new Error("useBedRoomContext doit être utilisé dans BedRoomProvider");
    return context;
}
