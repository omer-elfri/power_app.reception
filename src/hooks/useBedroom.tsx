"use client";

import React from "react";
import { useAuth } from "./useAuth";
import { useDataContext } from ".";

import { RoomCtgData } from "../configs/room_ctg";

import { Id, PriorityId, } from "../types";
import { CheckInType, CustomerType, ReservationType } from "../types/types";
import Employer from "../types/employer";
import BedRoom from "../types/bedroom";
import { getFrenchDate } from "../tools/date";
import { getCommonIds, getUniqueIds, unifyIds } from "../tools";

type AnalysisType = {
    solded: BedRoom.Type[],
    available: BedRoom.Type[],
    free: BedRoom.Type[],
    powered: BedRoom.Type[],
    issues: BedRoom.Type[],
    critics: BedRoom.Type[],
    coming: {
        total: BedRoom.Type[],
        sold: BedRoom.Type[],
        free: BedRoom.Type[],
    },
    cleaning: {
        total: BedRoom.Type[],
        sold: BedRoom.Type[],
        free: BedRoom.Type[],
        obsolets: BedRoom.Type[],
    },
    categories: (RoomCtgData & {
        topSolded: BedRoom.Type[],
        topTotal: BedRoom.Type[],
    })[],
}

export type CheckInProps = Omit<CheckInType, 'status' | 'start' | 'end'> & { night: number };

export type BedRoomContext = {
    analysis: AnalysisType,
    bedRooms: BedRoom.Map,
    bedRoomTab: BedRoom.Type[],

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

export function BedRoomProvider({ children }: { children: React.ReactNode }) {
    const { isAuth } = useAuth();
    const {
        bedroom_table, bedroom_ctg_table,
        cleanings, customers, isBookedToday, restaurant, isObsolet,

        cleaning_book, customer_book, reservation_book, getCleaner,
        addAlert, checkError, cleaners, getBookedPeriod,
    } = useDataContext();

    const [bedRooms, setBedRooms] = React.useState<BedRoom.Map>({});

    const bedRoomTab = React.useMemo<BedRoom.Type[]>(() => {
        return Object.values(bedRooms).sort( (a, b) => parseInt(a.name) - parseInt(b.name) );
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
        setBedRooms(bedRooms => Object.fromEntries( bedroom_table.list.map(room => {
            const clean = cleanings.find(clean => clean.roomId === room.id);
            const cleaner = getCleaner(clean?.valletId);
            const res = {
                ...bedRooms[room.id],
                ...bedroom_table.getId(room.id),
                cleaner: cleaner ? { ...cleaner, ...clean, } : null,
                customer: customers.find(customer => customer.roomId === room.id) ?? null,
                booked: isBookedToday(room.id),
                restauration: restaurant.filter(resto => {
                    const customer = customer_book.getId(resto.customerId);
                    return ( resto.customerId === customer?.id );
                }),
            }
            return [ room.id, res ];
        }) ) as BedRoom.Map );
    }, [bedroom_table, cleaners, cleanings, customers, isBookedToday, restaurant]);

    const analysis: AnalysisType = React.useMemo(() => {
        const powered = bedRoomTab.filter(room => room.power);
        const isCleanings = bedRoomTab.filter(room => room.cleaner);
        const solded = bedRoomTab.filter(room => room.customer);
        const checkOut = bedRoomTab.filter(room => !room.customer);
        const bookeds = bedRoomTab.filter(room => room.booked);
        const issues = bedRoomTab.filter(room => room.issue?.priority === 'high');
        const obsolets = bedRoomTab.filter(room => isObsolet(room.id));
        const critics = unifyIds([issues, obsolets]);

        return {
            powered, solded, issues, critics,
            free: getUniqueIds(bedRoomTab, unifyIds([ solded, bookeds, isCleanings, issues ]) ),
            available: getUniqueIds(bedRoomTab, unifyIds([ solded, issues ]) ),
            coming: {
                total: bookeds,
                sold: getCommonIds([bookeds, solded]),
                free: getCommonIds([bookeds, checkOut]),
            },
            cleaning: {
                total: isCleanings,
                sold: getCommonIds([isCleanings, solded]),
                free: getCommonIds([isCleanings, checkOut]),
                obsolets,
            },
            categories: bedroom_ctg_table.list.map((room_ctg) => {
                const topCtgRooms = bedRoomTab.filter(({ categories }) => (
                    categories[0] === room_ctg.id ) );
                return {
                    ...room_ctg,
                    topSolded: topCtgRooms.filter(room => room.customer),
                    topTotal: topCtgRooms,
                };
            }),
        }
    }, [bedRoomTab, bedroom_ctg_table, isObsolet]);



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
        checkError(() => {
            const issue = datas ? { date: new Date(), ...datas } : null;
            bedroom_table.update(roomId, { issue });
        });
    }, [bedRooms, bedroom_table.update]);

    const check_in = React.useCallback((roomId: BedRoom.Id, customer: Omit<CustomerType, 'actions'>, description?: string) => {
        checkError(() => {
            const room = bedRooms[roomId];
            if (room.customer) throw ['error', `La chambre ${roomId} est déja en check in`];

            const action: CheckInType = { status: 'CHECK_IN', roomId, datas: { customer }, date: new Date() };
            customer_book.add(roomId, { ...customer, actions: [action] }, description);
            throw ['sucess', `La chambre ${roomId} vendue`, `Vendue à ${customer.sexe} ${customer.name}`];
        });
    }, [customer_book, bedRooms]);

    const check_update = React.useCallback((customerId: number, props: Partial<CustomerType>, description?: string) => {
        checkError(() => {
            const customer = customer_book.getId(customerId);
            if (!customer) throw ['error', `Le client est introuvable`];

            const room = bedRooms[customer.roomId];
            if (!room.customer) throw ['error', `La chambre ${customer.roomId} n'est pas en check in`];

            const action: CheckInType = { status: 'CHECK_UPDATE', roomId: customer.roomId, datas: props, date: new Date() };
            customer_book.update(customerId, { ...props, actions: [ action, ...customer.actions, ] }, description);
            throw ['sucess', `Modification d'information client : ${customer.roomId}`, `Informations de ${customer.sexe} ${customer.name} modifiés avec succès`];
        });
    }, [customer_book]);

    const check_move = React.useCallback((customerId: number, toRoomId: BedRoom.Id, description?: string) => {
        checkError(() => {
            const toRoom = bedRooms[toRoomId];
            if (toRoom.customer) throw ['error', `La chambre cible ${toRoom.id} est déjà en check in`];

            const customer = customer_book.getId(customerId);
            if (!customer) throw ['error', `Le client ${customerId} est introuvable`];

            const room = bedRooms[customer.roomId];
            if (!room.customer) throw ['error', `La chambre ${room.id} n'est pas en check in`];

            const action: CheckInType = { status: 'CHECK_MOVE', roomId: toRoomId, datas: { fromRoomId: customer.roomId }, date: new Date() }
            customer_book.update(customerId, { roomId: toRoomId, actions: [ action, ...customer.actions, ] }, description);
            throw ['sucess', `Changement de chambre : ${customer.roomId} => ${toRoomId}`, `${customer.sexe} ${customer.name} s'est déplacé`];
        });
    }, [customer_book, bedRooms]);

    const check_out = React.useCallback((customerId: number, description?: string) => {
        checkError(() => {
            const customer = customer_book.getId(customerId);
            if (!customer) throw ['error', `Le client id ${customerId} est introuvable`];

            const clientResto = restaurant.filter(resto => resto.customerId === customerId && !resto.paid);
            const toPay = clientResto.reduce((res, food) => res + food.price, 0);
            addAlert(['warning', 'Restauration', `Le client ${customer.name} de la chambre ${customer.roomId} doit solder ${toPay} au restaurant`]);

            const action: CheckInType = { status: 'CHECK_OUT', roomId: customer.roomId, date: new Date() };
            customer_book.update(customerId, { actions: [ action, ...customer.actions ], end: new Date() }, description);
            throw ['sucess', `Check Out ${customer.roomId}`, `${customer.sexe} ${customer.name} a libéré`];
        });
    }, [customer_book, restaurant]);


    const clean_room = React.useCallback((roomId: BedRoom.Id, valletId: Employer.Id, description?: string) => {
        checkError(() => {
            const room = bedRooms[roomId];
            if (room.cleaner) throw ['error', `La chambre ${roomId} est déjà en nettoyage`];

            const vallet = getCleaner(valletId);
            if (!vallet) throw ['error', `Le vallet ${valletId} est introuvable`];

            cleaning_book.add(roomId, { valletId }, description);
            throw ['sucess', `Néttoyage ${roomId}`, `Attribué à ${vallet.sexe} ${vallet.name}`];
        });
    }, [cleaning_book.add, getCleaner, bedRooms]);
    
    const done_cleaning = React.useCallback((cleanId: Id, description?: string) => {
        checkError(() => {
            const clean = cleaning_book.getId(cleanId);
            if (!clean) throw ['error', `L'id ${cleanId} est introuvable'`];

            const vallet = getCleaner(clean.valletId);
            if (!vallet) throw ['error', `Le vallet ${clean.valletId} est introuvable`];

            cleaning_book.update(cleanId, { done: new Date() }, description);
            throw ['sucess', `Néttoyage ${clean.roomId}`, `Chambre propre - ${vallet.sexe} ${vallet.name}`];
        });
    }, [cleaning_book, getCleaner]);

    const cancel_cleaning = React.useCallback((cleanId: Id, description?: string) => {
        checkError(() => {
            const clean = cleaning_book.getId(cleanId);
            if (!clean) throw ['error', `L'id ${cleanId} est introuvable'`];

            cleaning_book.update(cleanId, { cancel: {
                date: new Date(), auth_session: isAuth().id,
            } }, description);
            throw ['sucess', `Annulation néttoyage ${clean.roomId}`, `Le néttoyage a été annulé`];
        });
    }, [cleaning_book, isAuth]);


    const book = React.useCallback((roomId: BedRoom.Id, props: ReservationType, description?: string) => {
        checkError(() => {
            const bookedInPeriod = getBookedPeriod(props.start, props.end);
            const isBooked = bookedInPeriod.find(booked => booked.roomId === roomId);
            if (isBooked) throw ['error', `La chambre ${roomId} à déjà été réservée par ${isBooked.name.toUpperCase()} du ${getFrenchDate(isBooked.start)} au ${isBooked.end ? getFrenchDate(isBooked.end) : '...'}`];

            reservation_book.add(roomId, props, description);
            throw ['sucess', `Réservation chambre ${roomId}`, `Réservée par Mr / Mme ${props.name} du ${getFrenchDate(props.start)} au ${getFrenchDate(props.end)}`];
        });
    }, [reservation_book.add, getBookedPeriod]);

    const cancel_book = React.useCallback((bookId: number, description?: string) => {
        checkError(() => {
            const room_rsv = reservation_book.getId(bookId);
            if (!room_rsv) throw ['error', `La reservation ${bookId} est introuvable'`];

            reservation_book.update(bookId, { cancel: { date: new Date(), auth_session: isAuth().id, } }, description);
            throw ['sucess', `Annulation réservation chambre ${room_rsv.roomId}`, `La réservation de Mr / Mme ${room_rsv.name} du ${getFrenchDate(room_rsv.start)} au ${getFrenchDate(room_rsv.end)} est annulée`];
        });
    }, [reservation_book, isAuth]);

    return (
        <bedRoomContext.Provider value={{
            analysis, bedRooms, bedRoomTab,
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

