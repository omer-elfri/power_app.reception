"use client";
import React from "react";

import { useAuth } from "./useAuth";
import { CheckInProps, useDataContext } from ".";

import { room_datas, roomIds } from "../configs/room";
import { employers_datas } from "../configs/employer";
import { CheckInType, CleanType, ReservationType } from "../types";
import Employer from "../types/employer";
import BedRoom from "../types/bedroom";
import { getFrenchDate, getFrenchDateTime, toTab } from "../tools";

export type BedRoomContext = {
    bedRooms: BedRoom.Map,
    bedRoomTab: BedRoom.Type[],
    updateBedRoom: (
        roomId: BedRoom.Id,
        props: Partial<BedRoom.Type>
    ) => void,

    switch_power: (roomId: BedRoom.Id, power: boolean | null) => void,
    check_in: (roomId: BedRoom.Id, props: CheckInProps) => void,
    check_update: (roomId: BedRoom.Id, props: CheckInProps) => void,
    check_move: (roomIdA: BedRoom.Id, roomIdB: BedRoom.Id, description?: string) => void,
    check_out: (roomId: BedRoom.Id, description?: string) => void,

    clean_room: (roomId: BedRoom.Id, valletId: Employer.Id, description?: string) => void,
    cancel_cleaning: (roomId: BedRoom.Id, description?: string) => void,
    getCleaningState: (roomId: BedRoom.Id) => string,

    book: (roomId: BedRoom.Id, props: ReservationType, description?: string) => void,
    cancel_book: (bookId: number, description?: string) => void,
}

const createBedRoom2 = (
    roomId: BedRoom.Id,
    props?: Partial<BedRoom.Type>,
): BedRoom.Type => {
    return ({
        ...room_datas[roomId],
        id: roomId,
        connected: false,
        power: false,
        checkIn: null,
        booked: null,
        cleaner: null,
        restauration: [],
        issue: null,
        ...props,
    });
}

export function BedRoomProvider({ children }: { children: React.ReactNode }) {
    const { authSession } = useAuth();
    const { roomMap, todayCustomers, todayBooked, cleanings, restaurant,
        getBookedPeriod,
        reservations,
        lastCleaneds,

        addToBook, updateBook,
        setCustomerBook,
        setCleaningBook,
        setReservationBook,
        addNotification,
    } = useDataContext();

    const [bedRooms, setBedRooms] = React.useState(
        Object.fromEntries( roomIds.map(roomId => [
            roomId, createBedRoom2(roomId)
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

    const createBedRoom = React.useCallback((
        roomId: BedRoom.Id,
        props?: Partial<BedRoom.Type>,
    ): BedRoom.Type => {
        return ({
            ...room_datas[roomId],
            id: roomId,
            connected: false,
            power: false,
            checkIn: todayCustomers[roomId]?.[0] ?? null,
            booked: todayBooked[roomId]?.[0] ?? null,
            cleaner: cleanings[roomId]?.[0] ?? null,
            restauration: restaurant.filter(resto => resto.roomId === roomId),
            issue: roomMap[roomId]?.issue ?? null,
            ...props,
        });
    }, [roomMap, todayCustomers, todayBooked, cleanings, restaurant, ]);

    React.useEffect(() => {
        setBedRooms(bedRooms => {
            return Object.fromEntries( roomIds.map(roomId => {
                const { connected, power } = bedRooms[roomId];
                const res = createBedRoom(roomId, { connected, power });
                return [ roomId, res ];
            }) ) as BedRoom.Map;
        })
    }, [createBedRoom]);



    const switch_power = React.useCallback((roomId: BedRoom.Id, power: boolean | null) => {
        if (power === null) {
            updateBedRoom(roomId, { connected: false});
            addNotification(roomId, { label: 'DISCONNECTED' });
        } else {
            updateBedRoom(roomId, { connected: true, power });
            addNotification(roomId, { label: power ? 'POWER_ON' : 'POWER_OFF' });
        }
    }, [updateBedRoom, addNotification]);


    const check_in = React.useCallback((roomId: BedRoom.Id, { night, ...props }: CheckInProps) => {
        const room = bedRooms[roomId];
        const end = night ? new Date(Date.now() + night*24*60*60*1000)  : null;

        if (room.checkIn)
            throw Error(`La chambre ${roomId} est déja en check in`);
        addNotification(roomId, { label: 'CHECK_IN', datas: { clientName: props.clientName } });
        const datas: CheckInType = { ...props, status: 'CHECK_IN', start: new Date(Date.now()), end, };
        addToBook(roomId, datas, setCustomerBook);
    }, [bedRooms, addToBook, addNotification]);

    const check_out = React.useCallback((roomId: BedRoom.Id, description?: string) => {
        const room = bedRooms[roomId];
        const toPay = restaurant
            .filter(resto => resto.roomId === roomId && !resto.paid)
            .reduce((res, food) => res + food.price, 0);

        if (!room.checkIn)
            throw Error(`La chambre ${roomId} n'est pas en check in`);
        if (toPay) alert(
            `La chambre ${roomId} doit solder ${toPay} au restaurant`);
        addNotification(roomId, { label: 'CHECK_OUT', datas: { clientName: room.checkIn.clientName } });
        const datas: CheckInType = { ...room.checkIn, description, status: 'CHECK_OUT', end: new Date(Date.now()), };
        addToBook(roomId, datas, setCustomerBook);
    }, [bedRooms, addToBook, addNotification, restaurant]);

    const check_update = React.useCallback((roomId: BedRoom.Id, props: CheckInProps) => {
        const room = bedRooms[roomId];

        if (!room.checkIn)
            throw Error(`La chambre ${roomId} n'est pas check in`);
        const checkIn: CheckInType = { ...room.checkIn, ...props, status: 'UPDATE', end: new Date(Date.now()) };
        addNotification(roomId, { label: 'CHECK_UPDATE', datas: { clientName: checkIn.clientName } });
        addToBook(roomId, checkIn, setCustomerBook);
    }, [bedRooms, addToBook, addNotification]);

    const check_move = React.useCallback((roomId: BedRoom.Id, roomIdB: BedRoom.Id, description?: string) => {
        const checkIn = bedRooms[roomId].checkIn;
        const checkInB = bedRooms[roomIdB].checkIn;
        console.log("move", roomId);

        if (!checkIn)
            throw Error(`La chambre ${roomId} n'est pas en check in`);
        if (checkInB)
            throw Error(`La chambre cible ${roomIdB} est en check in`);
        check_in(roomIdB, {...checkIn, description: 'MOVE'});
        check_out(roomId, 'MOVE');

        const checkIn1: CheckInType = { ...checkIn, status: 'MOVE_IN', end: null };
        const checkIn2: CheckInType = { ...checkIn, status: 'MOVE_OUT', description, end: new Date(Date.now()) };
        addToBook(roomId, checkIn2, setCustomerBook);
        addToBook(roomIdB, checkIn1, setCustomerBook);
        addNotification(roomId, { label: 'CHECK_MOVE', datas: { clientName: checkIn.clientName, toRoomId: roomIdB } });
    }, [bedRooms, addToBook, addNotification, check_in, check_out]);

    const clean_room = React.useCallback((roomId: BedRoom.Id, valletId: Employer.Id, description?: string) => {
        const room = bedRooms[roomId];
        if ( room.cleaner )
            throw Error(`La chambre ${roomId} est déjà en nettoyage`);
        const cleaning: CleanType = { valletId, description, }
        const cleanerName = employers_datas[valletId].name;
        addToBook(roomId, cleaning, setCleaningBook);
        addNotification(roomId, { label: 'CLEANING_START', datas: { cleanerName } });
    }, [bedRooms, addToBook, addNotification]);
    
    const cancel_cleaning = React.useCallback((roomId: BedRoom.Id, description?: string) => {
        const room = bedRooms[roomId];
        console.log("room.cleaner", room.cleaner)
        if ( !room.cleaner )
            throw Error(`La chambre ${roomId} n'est pas en nettoyage`);
        const cleanerName = employers_datas[room.cleaner.valletId].name;
        updateBook(room.cleaner.id, { description, cancel: new Date(Date.now()) }, setCleaningBook);
        addNotification(roomId, { label: 'CLEANING_CANCELED', datas: { cleanerName } });
    }, [bedRooms, updateBook, addNotification]);



    const getCleaningState = React.useCallback((roomId: BedRoom.Id) => {
        const lastCleaned = lastCleaneds[roomId];
        if (!lastCleaned) return "...";

        const now = new Date(Date.now());
        const endDate = ('done' in lastCleaned) ? lastCleaned.done : null;
        if (!endDate) return employers_datas[lastCleaned.valletId].name;

        const res = endDate.getTime() - now.getTime() > 3*24*60*60*1000;
        return !res ? "Propre" : "Non";
    }, [lastCleaneds]);



    const book = React.useCallback((roomId: BedRoom.Id, props: ReservationType, description?: string) => {
        const bookedInPeriod = getBookedPeriod(props.start, props.end);
        const isBooked = bookedInPeriod.find(booked => booked.roomId === roomId);

        console.log("tmp",
            getFrenchDateTime(props.start),
            props.end ? getFrenchDateTime(props.end) : null,

            isBooked?.start ? getFrenchDateTime(isBooked?.start) : null,
            isBooked?.end ? getFrenchDateTime(isBooked?.end) : null,
        );

        if (isBooked) throw Error(
            `La chambre ${roomId} à déjà été réservée par \
            ${isBooked.clientName.toUpperCase()} du ${getFrenchDate(isBooked.start)} au \
            ${isBooked.end ? getFrenchDate(isBooked.end) : '...'}`
        );
        const datas = { ...props, description };
        addToBook(roomId, datas, setReservationBook);
        addNotification(roomId, { label: 'BOOKED', datas: {
            bookerName: datas.clientName,
            bookedDate: new Date(Date.now()),
        } });
    }, [bedRooms, addToBook, getBookedPeriod, addNotification]);

    const cancel_book = React.useCallback((bookId: number, description?: string) => {
        const room_rsv = reservations.find(rsv => rsv.id === bookId);
        if (!room_rsv) throw Error("Réservation introuvable");
        if (!authSession) throw Error("Vous devez être connecté");
        const datas = { ...room_rsv, description,
            cancel: {
                date: new Date(Date.now()),
                auth_session: authSession.id,
            } };
        updateBook(bookId, datas, setReservationBook);
        // addNotification(room_rsv.roomId, { label: 'BOOKED_CANCELED', datas });
    }, [authSession, reservations, updateBook, addNotification]);


    return (
        <bedRoomContext.Provider value={{
            bedRooms,
            bedRoomTab,
            updateBedRoom,

            switch_power,

            check_in,
            check_out,
            check_update,
            check_move,

            clean_room,
            cancel_cleaning,
            getCleaningState,

            book,
            cancel_book,

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
