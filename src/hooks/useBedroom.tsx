"use client";
import React from "react";

import { CheckInProps, useDataContext } from ".";

import { room_datas, roomIds } from "../configs/room";
import BedRoom from "../types/bedroom";
import { toTab } from "../tools";
import Employer from "../types/employer";
import { employers_datas } from "../configs/employer";
import { CheckInType } from "../types";

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
    check_move: (roomIdA: BedRoom.Id, roomIdB: BedRoom.Id) => void,
    check_out: (roomId: BedRoom.Id, description?: string) => void,

    clean_room: (roomId: BedRoom.Id, valletId: Employer.Id, description?: string) => void,
    cancel_cleaning: (roomId: BedRoom.Id, description?: string) => void,
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
    const { roomMap, todayCustomers, todayBooked, cleanings, restaurant,
        addCleaning, addClientEvent, cancelCleaning, addNotification } = useDataContext();

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
    }, [updateBedRoom]);


    const check_in = React.useCallback((roomId: BedRoom.Id, { night, ...props }: CheckInProps) => {
        const room = bedRooms[roomId];
        const end = night ? new Date(Date.now() + night*24*60*60*1000)  : null;

        if (room.checkIn)
            throw Error(`La chambre ${roomId} est déja en check in`);
        addNotification(roomId, { label: 'CHECK_IN', datas: { clientName: props.clientName } });
        addClientEvent(roomId, { ...props, status: 'CHECK_IN', start: new Date(Date.now()), end, });
    }, [bedRooms, addClientEvent]);

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
        addClientEvent(roomId, { ...room.checkIn, description, status: 'CHECK_OUT', end: new Date(Date.now()), });
    }, [bedRooms, restaurant, addClientEvent]);

    const check_update = React.useCallback((roomId: BedRoom.Id, props: CheckInProps) => {
        const room = bedRooms[roomId];

        if (!room.checkIn)
            throw Error(`La chambre ${roomId} n'est pas check in`);
        const checkIn: CheckInType = { ...room.checkIn, ...props, status: 'UPDATE', end: new Date(Date.now()) };
        addNotification(roomId, { label: 'CHECK_UPDATE', datas: { clientName: checkIn.clientName } });
        addClientEvent(roomId, checkIn);
    }, [bedRooms, addClientEvent]);

    const check_move = React.useCallback((roomId: BedRoom.Id, roomIdB: BedRoom.Id) => {
        const checkIn = bedRooms[roomId].checkIn;
        const checkInB = bedRooms[roomIdB].checkIn;

        if (!checkIn)
            throw Error(`La chambre ${roomId} n'est pas en check in`);
        if (checkInB)
            throw Error(`La chambre cible ${roomIdB} est en check in`);
        check_in(roomIdB, {...checkIn, description: 'MOVE'});
        check_out(roomId, 'MOVE');

        addClientEvent(roomIdB, { ...checkIn, status: 'MOVE_IN', end: new Date(Date.now()) });
        addClientEvent(roomId, { ...checkIn, status: 'MOVE_OUT', end: new Date(Date.now()) });
        addNotification(roomId, { label: 'CHECK_MOVE', datas: { clientName: checkIn.clientName, toRoomId: roomIdB } });
    }, [bedRooms]);

    const clean_room = React.useCallback((roomId: BedRoom.Id, valletId: Employer.Id, description?: string) => {
        const room = bedRooms[roomId];
        if ( room.cleaner )
            throw Error(`La chambre ${roomId} est déjà en nettoyage`);
        const cleaning = {
            valletName: employers_datas[valletId].name,
            description,
        }
        addCleaning(roomId, cleaning);
        addNotification(roomId, { label: 'CLEANING_START', datas: { cleanerName: cleaning.valletName } });
    }, [bedRooms, cleanings]);
    
    const cancel_cleaning = React.useCallback((roomId: BedRoom.Id, description?: string) => {
        const room = bedRooms[roomId];
        if ( !room.cleaner )
            throw Error(`La chambre ${roomId} n'est pas en nettoyage`);
        cancelCleaning(room.cleaner.id, description);
        addNotification(roomId, { label: 'CLEANING_CANCELED', datas: { cleanerName: room.cleaner.valletName } });
    }, [bedRooms]);



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
