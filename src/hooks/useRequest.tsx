'use client';

import React from "react";
import { useDataContext } from ".";
import { useAuth } from "./useAuth";
import { useVisual } from "./useVisual";
import { useAnalysis } from "./useAnalysis";

import { Id, PriorityId, } from "../types";
import { CheckInType, CustomerType, ReservationType } from "../types/types";
import Employer from "../types/employer";
import BedRoom from "../types/bedroom";
import { getFrenchDate } from "../tools/date";

export type CheckInProps = Omit<CheckInType, 'status' | 'start' | 'end'> & { night: number };

export type RequestContext = {
    switch_power: (roomId: BedRoom.Id, power: boolean | null) => void,
    updateIssue: (roomId: BedRoom.Id, datas: { priority: PriorityId, message: string } | null) => Promise<void>,

    check_in: (roomId: BedRoom.Id, props: Omit<CustomerType, 'actions'>) => Promise<void>,
    check_move: (roomId: BedRoom.Id, roomIdB: BedRoom.Id) => Promise<void>,
    check_out: (roomId: BedRoom.Id) => Promise<void>,

    clean_room: (roomId: BedRoom.Id, valletId: Employer.Id) => Promise<void>,
    clean_done: (roomId: BedRoom.Id) => Promise<void>,
    clean_cancel: (roomId: BedRoom.Id) => Promise<void>,

    book: (roomId: BedRoom.Id, props: ReservationType) => Promise<void>,
    cancel_book: (bookId: Id) => Promise<void>,

    pay_restaurant: (restoId: Id) => Promise<void>,
}

export function RequestProvider({ children }: { children: React.ReactNode }) {
    const analysis = useAnalysis();
    const { addAlert, checkAlert, } = useVisual();
    const { bedRooms, updateBedRoom, getBookedPeriod, } = analysis;
    const { cleaners } = useAuth();
    const {
        bedroom_table, restaurant_book,
        cleaning_book, customer_book, reservation_book,
    } = useDataContext();


    const switch_power = React.useCallback((roomId: BedRoom.Id, power: boolean | null) => {
        checkAlert(() => {
            if (power === null) updateBedRoom(roomId, { connected: false });
            else updateBedRoom(roomId, { connected: true, power });
            throw ['sucess', `La chambre ${roomId} est ${power === null ?
                "déconnectée" : power ? "alimentée" : "éteinte"}`];
        });
    }, [updateBedRoom]);

    const updateIssue = React.useCallback(async (roomId: BedRoom.Id,
        datas: { priority: PriorityId, message: string } | null,
    ) => {
        await checkAlert(async () => {
            const issue = datas ? { date: new Date(), ...datas } : null;
            await bedroom_table.update(roomId, { issue });
            throw ['sucess', `Chambre ${roomId}`, `Issue mis à jour avec succès !`];
        });
    }, [bedRooms, bedroom_table.update, updateBedRoom]);


    const check_in = React.useCallback(async (roomId: BedRoom.Id, customer: Omit<CustomerType, 'actions'>) => {
        await checkAlert(async () => {
            const room = bedRooms[roomId];
            if (!room) throw ['error', `Cette chambre ${roomId} n'existe pas ou est désactivée`];
            if (room.customer) throw ['error', `La chambre ${roomId} est déja en check in`];

            if (customer.name === "") throw ['error', `Renseignez le nom du client`];
            if (customer.price < 0) throw ['error', `Le prix ne peut pas être négatif`];

            const action: CheckInType = { status: 'CHECK_IN', room_id: roomId, datas: { customer }, date: new Date() };
            await customer_book.add(roomId, { ...customer, actions: [action] });
            throw ['sucess', `La chambre ${roomId} vendue`, `Vendue à ${customer.sexe} ${customer.name}`];
        });
    }, [customer_book, bedRooms, updateBedRoom]);

    const check_move = React.useCallback(async (roomId: BedRoom.Id, toRoomId: BedRoom.Id) => {
        await checkAlert(async () => {
            const room = bedRooms[roomId];
            if (!room) throw ['error', `Cette chambre ${roomId} n'existe pas ou est désactivée`];
            const { customer } = room;
            const toRoom = bedRooms[toRoomId];

            if (!customer) throw ['error', `La chambre ${roomId} n'est pas en check in`];
            if (toRoom.customer) throw ['error', `La chambre cible ${toRoom.id} est déjà en check in`];

            const action: CheckInType = { status: 'CHECK_MOVE', room_id: toRoomId, datas: { fromRoomId: roomId }, date: new Date() }
            await customer_book.update(customer.id, { room_id: toRoomId, actions: [action, ...customer.actions,] });
            throw ['sucess', `Changement de chambre : ${roomId} => ${toRoomId}`, `${customer.sexe} ${customer.name} s'est déplacé`];
        });
    }, [customer_book, bedRooms, updateBedRoom]);

    const check_out = React.useCallback(async (roomId: BedRoom.Id) => {
        await checkAlert(async () => {
            const room = bedRooms[roomId];
            if (!room) throw ['error', `Cette chambre ${roomId} n'existe pas ou est désactivée`];
            const { customer } = room;

            if (!customer) throw ['error', `La chambre ${roomId} n'est pas en check in`];

            const toPay = customer?.restaurant.reduce((res, food) => res + food.price, 0);
            if (toPay !== 0) addAlert(['warning', 'Restauration', `Le client ${customer.name} de la chambre ${roomId} doit solder ${toPay} au restaurant`]);

            const action: CheckInType = { status: 'CHECK_OUT', room_id: roomId, date: new Date() };
            await customer_book.update(customer.id, { actions: [action, ...customer.actions], end: new Date() });
            throw ['sucess', `Check out ${roomId}`, `${customer.sexe} ${customer.name} a libéré`];
        });
    }, [customer_book, restaurant_book.list, updateBedRoom]);


    const clean_room = React.useCallback(async (roomId: BedRoom.Id, valetId: Employer.Id) => {
        await checkAlert(async () => {
            const room = bedRooms[roomId];
            if (!room) throw ['error', `Cette chambre ${roomId} n'existe pas ou est désactivée`];
            if (room.cleaning) throw ['error', `La chambre ${roomId} est déjà en nettoyage`];

            const valet = cleaners.find(cleaner => cleaner.id === valetId) ?? null;
            if (!valet) throw ['error', `Le vallet ${valetId} est introuvable`];

            await cleaning_book.add(roomId, { valet_id: valetId });
            throw ['sucess', `Néttoyage ${roomId}`, `Attribué à ${valet.sexe} ${valet.name}`];
        });
    }, [bedRooms, cleaning_book.add, cleaners, updateBedRoom]);

    const clean_done = React.useCallback(async (roomId: BedRoom.Id) => {
        await checkAlert(async () => {
            const room = bedRooms[roomId];
            if (!room) throw ['error', `Cette chambre ${roomId} n'existe pas ou est désactivée`];
            if (!room.cleaning) throw ['error', `La chambre ${roomId} n'est pas en nettoyage`];

            await cleaning_book.update(room.cleaning.id, { done: new Date() });
            throw ['sucess', `Néttoyage ${roomId}`, `Chambre propre - ${room.cleaning.valet ? room.cleaning.valet.sexe+" "+room.cleaning.valet.name : "..."}`];
        });
    }, [bedRooms, cleaning_book, updateBedRoom]);

    const clean_cancel = React.useCallback(async (roomId: BedRoom.Id) => {
        await checkAlert(async () => {
            const room = bedRooms[roomId];
            if (!room) throw ['error', `Cette chambre ${roomId} n'existe pas ou est désactivée`]
            if (!room.cleaning) throw ['error', `La chambre ${roomId} n'est pas en nettoyage`];

            await cleaning_book.cancel(room.cleaning.id);
            throw ['sucess', `Annulation néttoyage ${roomId}`, `Le néttoyage a été annulé`];
        });
    }, [bedRooms, cleaning_book, updateBedRoom]);


    const book = React.useCallback(async (roomId: BedRoom.Id, props: ReservationType) => {
        await checkAlert(async () => {
            const bookedInPeriod = getBookedPeriod(props.start_date, props.end_date);
            const isBooked = bookedInPeriod.find(booked => booked.room_id === roomId);
            if (isBooked) throw ['error', `La chambre ${roomId} à déjà été réservée par ${isBooked.name.toUpperCase()} du ${getFrenchDate(isBooked.start_date)} au ${isBooked.end_date ? getFrenchDate(isBooked.end_date) : '...'}`];
            await reservation_book.add(roomId, props);
            throw ['sucess', `Réservation chambre ${roomId}`, `Réservée par Mr / Mme ${props.name} du ${getFrenchDate(props.start_date)} au ${getFrenchDate(props.end_date)}`];
        });
    }, [reservation_book, getBookedPeriod, updateBedRoom]);

    const cancel_book = React.useCallback(async (bookId: Id) => {
        await checkAlert(async () => {
            const room_rsv = reservation_book.getId(bookId);
            if (!room_rsv) throw ['error', `La reservation ${bookId} est introuvable'`];

            await reservation_book.cancel(bookId);
            throw ['sucess', `Annulation réservation chambre ${room_rsv.room_id}`, `La réservation de Mr / Mme ${room_rsv.name} du ${getFrenchDate(room_rsv.start_date)} au ${getFrenchDate(room_rsv.end_date)} est annulée`];
        });
    }, [reservation_book, updateBedRoom]);


    const pay_restaurant = React.useCallback(async (restoId: Id) => {
        await checkAlert(async () => {
            const resto = restaurant_book.getId(restoId);
            if (!resto) throw ['error', `La restauration ${restoId} est introuvable'`];

            await restaurant_book.update(restoId, { paid: true });
            const { customer } = resto;
            throw ['sucess', `Payment restauration`, `La réservation "${resto.article}" de ${customer ? customer.sexe+" "+customer.name : "..."} est réglée`];
        });
    }, [reservation_book, updateBedRoom]);


    return (
        <requestContext.Provider value={{
            ...analysis,
            switch_power, updateIssue,
            check_in, check_move, check_out,
            clean_room, clean_done, clean_cancel,
            book, cancel_book,
            pay_restaurant,
        }}> {children}
        </requestContext.Provider>
    );
}

const requestContext = React.createContext<RequestContext | null>(null);

export function useRequest() {
    const context = React.useContext(requestContext);
    if (!context)
        throw new Error("useRequestContext doit être utilisé dans RequestProvider");
    return context;
}

