"use client";

import React from "react";
import { useDataContext } from ".";
import { AnalysisData, useAnalysis } from "./useBedroom";

import { Id, PriorityId, } from "../types";
import { CheckInType, CustomerType, ReservationType } from "../types/types";
import Employer from "../types/employer";
import BedRoom from "../types/bedroom";
import { getFrenchDate } from "../tools/date";

export type CheckInProps = Omit<CheckInType, 'status' | 'start' | 'end'> & { night: number };

export type RequestContext = AnalysisData & {
    switch_power: (roomId: BedRoom.Id, power: boolean | null) => void,
    updateIssue: (roomId: BedRoom.Id, datas: {priority: PriorityId, message: string} | null) => void,

    check_in: (roomId: BedRoom.Id, props: Omit<CustomerType, 'actions'>, description?: string) => void,
    check_update: (customerId: number, props: Partial<CustomerType>, description?: string) => void,
    check_move: (customerId: number, roomIdB: BedRoom.Id, description?: string) => void,
    check_out: (customerId: number, description?: string) => void,

    clean_room: (roomId: BedRoom.Id, valletId: Employer.Id, description?: string) => void,
    done_cleaning: (cleanId: Id, description?: string) => void,
    cancel_cleaning: (cleanId: Id, description?: string) => void,

    book: (roomId: BedRoom.Id, props: ReservationType, description?: string) => void,
    cancel_book: (bookId: Id, description?: string) => void,
}

export function RequestProvider({ children }: { children: React.ReactNode }) {
    const analysis = useAnalysis();
    const { bedRooms, updateBedRoom } = analysis;
    const {
        bedroom_table, restaurant_book,
        cleaning_book, customer_book, reservation_book,
        getCleaner, addAlert, checkError, getBookedPeriod,
    } = useDataContext();

    
    const switch_power = React.useCallback((roomId: BedRoom.Id, power: boolean | null) => {
        checkError(() => {
            if (power === null) updateBedRoom(roomId, { connected: false });
            else updateBedRoom(roomId, { connected: true, power });
            throw ['sucess', `La chambre ${roomId} est ${power === null ?
                "déconnectée" : power ? "alimentée" : "éteinte" }`];
        });
    }, [updateBedRoom]);

    const updateIssue = React.useCallback((roomId: BedRoom.Id,
        datas: { priority: PriorityId, message: string } | null,
    ) => {
        checkError(async () => {
            const issue = datas ? { date: new Date(), ...datas } : null;
            bedroom_table.update(roomId, { issue });
        });
    }, [bedRooms, bedroom_table.update]);

    const check_in = React.useCallback((roomId: BedRoom.Id, customer: Omit<CustomerType, 'actions'>, description?: string) => {
        checkError(async () => {
            const room = bedRooms[roomId];
            if (room.customer) throw ['error', `La chambre ${roomId} est déja en check in`];

            const action: CheckInType = { status: 'CHECK_IN', room_id: roomId, datas: { customer }, date: new Date() };
            await customer_book.add(roomId, { ...customer, actions: [action] }, description);
            throw ['sucess', `La chambre ${roomId} vendue`, `Vendue à ${customer.sexe} ${customer.name}`];
        });
    }, [customer_book, bedRooms]);

    const check_update = React.useCallback((customerId: number, props: Partial<CustomerType>, description?: string) => {
        checkError(async () => {
            const customer = customer_book.getId(customerId);
            if (!customer) throw ['error', `Le client est introuvable`];

            const room = bedRooms[customer.room_id];
            if (!room.customer) throw ['error', `La chambre ${customer.room_id} n'est pas en check in`];

            const action: CheckInType = { status: 'CHECK_UPDATE', room_id: customer.room_id, datas: props, date: new Date() };
            await customer_book.update(customerId, { ...props, actions: [ action, ...customer.actions, ] }, description);
            throw ['sucess', `Modification d'information client : ${customer.room_id}`, `Informations de ${customer.sexe} ${customer.name} modifiés avec succès`];
        });
    }, [customer_book]);

    const check_move = React.useCallback((customerId: number, toRoomId: BedRoom.Id, description?: string) => {
        checkError(async () => {
            const toRoom = bedRooms[toRoomId];
            if (toRoom.customer) throw ['error', `La chambre cible ${toRoom.id} est déjà en check in`];

            const customer = customer_book.getId(customerId);
            if (!customer) throw ['error', `Le client ${customerId} est introuvable`];

            const room = bedRooms[customer.room_id];
            if (!room.customer) throw ['error', `La chambre ${room.id} n'est pas en check in`];

            const action: CheckInType = { status: 'CHECK_MOVE', room_id: toRoomId, datas: { fromRoomId: customer.room_id }, date: new Date() }
            await customer_book.update(customerId, { room_id: toRoomId, actions: [ action, ...customer.actions, ] }, description);
            throw ['sucess', `Changement de chambre : ${customer.room_id} => ${toRoomId}`, `${customer.sexe} ${customer.name} s'est déplacé`];
        });
    }, [customer_book, bedRooms]);

    const check_out = React.useCallback((customerId: number, description?: string) => {
        checkError(async () => {
            const customer = customer_book.getId(customerId);
            if (!customer) throw ['error', `Le client id ${customerId} est introuvable`];

            const clientResto = restaurant_book.list.filter(resto => resto.customer_id === customerId && !resto.paid);
            const toPay = clientResto.reduce((res, food) => res + food.price, 0);
            addAlert(['warning', 'Restauration', `Le client ${customer.name} de la chambre ${customer.room_id} doit solder ${toPay} au restaurant`]);

            const action: CheckInType = { status: 'CHECK_OUT', room_id: customer.room_id, date: new Date() };
            await customer_book.update(customerId, { actions: [ action, ...customer.actions ], end: new Date() }, description);
            throw ['sucess', `Check Out ${customer.room_id}`, `${customer.sexe} ${customer.name} a libéré`];
        });
    }, [customer_book, restaurant_book.list]);


    const clean_room = React.useCallback((roomId: BedRoom.Id, valletId: Employer.Id, description?: string) => {
        checkError(async () => {
            const room = bedRooms[roomId];
            if (room.clean) throw ['error', `La chambre ${roomId} est déjà en nettoyage`];

            const vallet = getCleaner(valletId);
            if (!vallet) throw ['error', `Le vallet ${valletId} est introuvable`];

            await cleaning_book.add(roomId, { valet_id: valletId }, description);
            throw ['sucess', `Néttoyage ${roomId}`, `Attribué à ${vallet.sexe} ${vallet.name}`];
        });
    }, [cleaning_book.add, getCleaner, bedRooms]);
    
    const done_cleaning = React.useCallback((cleanId: Id, description?: string) => {
        checkError(async () => {
            const clean = cleaning_book.getId(cleanId);
            if (!clean) throw ['error', `L'id ${cleanId} est introuvable'`];

            const vallet = getCleaner(clean.valet_id);
            if (!vallet) throw ['error', `Le vallet ${clean.valet_id} est introuvable`];

            await cleaning_book.update(cleanId, { done: new Date() }, description);
            throw ['sucess', `Néttoyage ${clean.room_id}`, `Chambre propre - ${vallet.sexe} ${vallet.name}`];
        });
    }, [cleaning_book, getCleaner]);

    const cancel_cleaning = React.useCallback((cleanId: Id) => {
        checkError(async () => {
            const clean = cleaning_book.getId(cleanId);
            if (!clean) throw ['error', `L'id ${cleanId} est introuvable'`];

            await cleaning_book.cancel(cleanId);
            throw ['sucess', `Annulation néttoyage ${clean.room_id}`, `Le néttoyage a été annulé`];
        });
    }, [cleaning_book]);


    const book = React.useCallback((roomId: BedRoom.Id, props: ReservationType, description?: string) => {
        checkError(async () => {
            const bookedInPeriod = getBookedPeriod(props.start_date, props.end_date);
            const isBooked = bookedInPeriod.find(booked => booked.room_id === roomId);
            if (isBooked) throw ['error', `La chambre ${roomId} à déjà été réservée par ${isBooked.name.toUpperCase()} du ${getFrenchDate(isBooked.start_date)} au ${isBooked.end_date ? getFrenchDate(isBooked.end_date) : '...'}`];

            await reservation_book.add(roomId, props, description);
            throw ['sucess', `Réservation chambre ${roomId}`, `Réservée par Mr / Mme ${props.name} du ${getFrenchDate(props.start_date)} au ${getFrenchDate(props.end_date)}`];
        });
    }, [reservation_book.add, getBookedPeriod]);

    const cancel_book = React.useCallback((bookId: number) => {
        checkError(async () => {
            const room_rsv = reservation_book.getId(bookId);
            if (!room_rsv) throw ['error', `La reservation ${bookId} est introuvable'`];

            await reservation_book.cancel(bookId);
            throw ['sucess', `Annulation réservation chambre ${room_rsv.room_id}`, `La réservation de Mr / Mme ${room_rsv.name} du ${getFrenchDate(room_rsv.start_date)} au ${getFrenchDate(room_rsv.end_date)} est annulée`];
        });
    }, [reservation_book]);

    return (
        <requestContext.Provider value={{
            ...analysis,
            switch_power, updateIssue,
            check_in, check_update, check_move, check_out,
            clean_room, done_cleaning, cancel_cleaning,
            book, cancel_book,

        }}> { children }
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

