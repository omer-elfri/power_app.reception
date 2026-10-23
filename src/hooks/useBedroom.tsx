"use client";

import React from "react";
import { useAuth } from "./useAuth";
import { useDataContext } from ".";

import { RoomCtgData } from "../configs/room_ctg";

import { TypeWithTrace, PriorityId, } from "../types";
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
    done_cleaning: (roomId: BedRoom.Id, description?: string) => void,
    cancel_cleaning: (roomId: BedRoom.Id, description?: string) => void,

    book: (roomId: BedRoom.Id, props: ReservationType, description?: string) => void,
    cancel_book: (bookId: number, description?: string) => void,
}

export function BedRoomProvider({ children }: { children: React.ReactNode }) {
    const { authSession } = useAuth();
    const { checkError, isObsolet,
        employer_table, bedroom_ctg_table,
        bedroom_table, cleaning_book, customer_book, reservation_book,
        cleanings, customers, reservations, restaurant,
        getBookedPeriod, isBookedToday,
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
            const res = {
                ...bedRooms[room.id],
                ...bedroom_table.getId(room.id),

                cleaner: cleanings.find(clean => clean.roomId === room.id) ?? null,
                customer: customers.find(customer => customer.roomId === room.id) ?? null,
                booked: isBookedToday(room.id),
                restauration: restaurant.filter(resto => {
                    const customer = customer_book.get.find(customer => customer.id === resto.customerId);
                    return ( resto.customerId === customer?.id );
                }),
            }
            return [ room.id, res ];
        }) ) as BedRoom.Map );
    }, [bedroom_table, cleanings, customers, isBookedToday, restaurant]);

    const analysis: AnalysisType = React.useMemo(() => {
        const powered = bedRoomTab.filter(room => room.power);
        const cleanings = bedRoomTab.filter(room => room.cleaner);
        const solded = bedRoomTab.filter(room => room.customer);
        const checkOut = bedRoomTab.filter(room => !room.customer);
        const bookeds = bedRoomTab.filter(room => room.booked);
        const issues = bedRoomTab.filter(room => room.issue?.priority === 'high');
        const obsolets = bedRoomTab.filter(room => isObsolet(room.id));
        const critics = unifyIds([issues, obsolets]);

        return {
            powered, solded, issues, critics,
            free: getUniqueIds(bedRoomTab, unifyIds([ solded, bookeds, cleanings, issues ]) ),
            available: getUniqueIds(bedRoomTab, unifyIds([ solded, issues ]) ),
            coming: {
                total: bookeds,
                sold: getCommonIds([bookeds, solded]),
                free: getCommonIds([bookeds, checkOut]),
            },
            cleaning: {
                total: cleanings,
                sold: getCommonIds([cleanings, solded]),
                free: getCommonIds([cleanings, checkOut]),
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
    }, [bedRoomTab, bedroom_ctg_table]);



        

    const switch_power = React.useCallback((roomId: BedRoom.Id, power: boolean | null) => {
        checkError(() => {
            if (power === null) {
                updateBedRoom(roomId, { connected: false});
            } else {
                updateBedRoom(roomId, { connected: true, power });
            }
        }, `La chambre ${roomId} est ${power === null ? "déconnectée" : power ? "alimentée" : "éteinte" }`);
    }, [updateBedRoom]);

    const updateIssue = React.useCallback((roomId: BedRoom.Id, datas: {priority: PriorityId, message: string} | null) => {
        checkError(() => {
            console.log("tmp")
            bedroom_table.update(roomId, { issue: datas ? { date: new Date(Date.now()), ...datas } : null });
        });
    }, [bedRooms, bedroom_table.update]);

    const check_in = React.useCallback((roomId: BedRoom.Id, customer: Omit<CustomerType, 'actions'>, description?: string) => {
        checkError(() => {
            const room = bedRooms[roomId];
            if (room.customer)
                throw Error(`La chambre ${roomId} est déja en check in`);
            const action: CheckInType = { status: 'CHECK_IN', roomId,
                datas: { customer }, date: new Date(Date.now()) };
            const res: CustomerType = {...customer, actions: [action]}
            customer_book.add(roomId, res, description);
        }, `La chambre ${roomId} est vendue à ${customer.sexe} ${customer.name}`);
    }, [bedRooms, customer_book.add]);

    const check_update = React.useCallback((customerId: number, props: Partial<CustomerType>, description?: string) => {
        const customer = customers[customerId];
        checkError(() => {
            if (!customer) throw Error(`Le client est introuvable`);
    
            const action: CheckInType = { status: 'CHECK_UPDATE', roomId: customer.roomId,
                datas: props, date: new Date(Date.now()) };
            const res: Partial<CustomerType> = { ...props, actions: [ action, ...customer.actions, ] }
            customer_book.update(customerId, res, description);
        }, `Informations de ${customer.sexe} ${customer.name} modifiés avec succès`);
    }, [customers, customer_book.update]);

    const check_move = React.useCallback((customerId: number, toRoomId: BedRoom.Id, description?: string) => {
        checkError(() => {
            const customer = customers[customerId];
            if (!customer)
                throw Error(`Le client est introuvable`);
            if (bedRooms[toRoomId].customer)
                throw Error(`La chambre cible ${toRoomId} est en check in`);
    
            const action: CheckInType = { status: 'CHECK_MOVE', roomId: toRoomId,
                datas: { fromRoomId: customer.roomId }, date: new Date(Date.now()) };
            const res: Partial<TypeWithTrace<CustomerType>> = { roomId: toRoomId, actions: [action, ...customer.actions, ]}
            customer_book.update(customerId, res, description);
        }, `${customers[customerId].sexe} ${customers[customerId].name} de la chambre ${customers[customerId].roomId} s'est déplacé dans la chambre ${toRoomId}`);
    }, [customers, customer_book.update, bedRooms]);

    const check_out = React.useCallback((customerId: number, description?: string) => {
        checkError(() => {
            const customer = customers[customerId];
            if (!customer) throw Error(`Le client est introuvable`);
    
            const toPay = restaurant
                .filter(resto => resto.customerId === customerId && !resto.paid)
                .reduce((res, food) => res + food.price, 0);
            if (toPay) alert(
                `Le client ${customer.name} de la chambre ${customer.roomId} doit solder ${toPay} au restaurant`);
            const action: CheckInType = { status: 'CHECK_OUT', roomId: customer.roomId, date: new Date(Date.now()) };
            const res: Partial<CustomerType> = { actions: [action, ...customer.actions], end: new Date(Date.now())}
            customer_book.update(customerId, res, description);
        }, `${customers[customerId].sexe} ${customers[customerId].name} à libéré la chambre ${customers[customerId].roomId}`);
    }, [customers, customer_book.update, restaurant]);


    const clean_room = React.useCallback((roomId: BedRoom.Id, valletId: Employer.Id, description?: string) => {
        const vallet = employer_table.getId(valletId);
        checkError(() => {
            const room = bedRooms[roomId];
            if ( !vallet )
                throw Error(`Le vallet ${valletId} est introuvable`);
            if ( room.cleaner )
                throw Error(`La chambre ${roomId} est déjà en nettoyage`);
            cleaning_book.add(roomId, { valletId,
                sexe: vallet.sexe,
                name: vallet.name,
            }, description);
        }, `Le néttoyage de la chambre ${roomId} est attribué à ${vallet?.sexe} ${vallet?.name}`);
    }, [employer_table, bedRooms, cleaning_book.add]);
    
    const done_cleaning = React.useCallback((roomId: BedRoom.Id, description?: string) => {
        checkError(() => {
            const room = bedRooms[roomId];
            if ( !room.cleaner )
                throw Error(`La chambre ${roomId} n'est pas en nettoyage`);
            cleaning_book.update(room.cleaner.id, { done: new Date(Date.now()) }, description);
        }, `La chambre ${roomId} à été néttoyée par ${bedRooms[roomId].cleaner?.sexe} ${bedRooms[roomId].cleaner?.name}`);
    }, [bedRooms, cleaning_book.update]);

    const cancel_cleaning = React.useCallback((roomId: BedRoom.Id, description?: string) => {
        const { authSession } = useAuth();
        checkError(() => {
            const room = bedRooms[roomId];
            if (!authSession)
                throw Error(`Vous devez être connecté`);
            if ( !room.cleaner )
                throw Error(`La chambre ${roomId} n'est pas en nettoyage`);
            cleaning_book.update(room.cleaner.id, { cancel: {
                date: new Date(Date.now()),
                auth_session: authSession.id,
            } }, description);
        }, `La chambre ${roomId} n'est plus en néttoyage`);
    }, [bedRooms, cleaning_book.update]);


    const book = React.useCallback((roomId: BedRoom.Id, props: ReservationType, description?: string) => {
        checkError(() => {
            const bookedInPeriod = getBookedPeriod(props.start, props.end);
            const isBooked = bookedInPeriod.find(booked => booked.roomId === roomId);
    
            if (isBooked) throw Error(
                `La chambre ${roomId} à déjà été réservée par \
                ${isBooked.name.toUpperCase()} du ${getFrenchDate(isBooked.start)} au \
                ${isBooked.end ? getFrenchDate(isBooked.end) : '...'}`
            );
            const datas = { ...props, description };
            reservation_book.add(roomId, datas, description);
        }, `La chambre ${roomId} à été réservée par Mr / Mme ${props.name} du ${getFrenchDate(props.start)} au ${getFrenchDate(props.end)}`);
    }, [bedRooms, reservation_book.add, getBookedPeriod]);

    const cancel_book = React.useCallback((bookId: number, description?: string) => {
        const room_rsv = reservations.find(rsv => rsv.id === bookId);
        if (!room_rsv) throw Error("Réservation introuvable");
        checkError(() => {
            if (!authSession) throw Error("Vous devez être connecté");
            const datas = { ...room_rsv, description,
                cancel: {
                    date: new Date(Date.now()),
                    auth_session: authSession.id,
                } };
            reservation_book.update(bookId, datas, description);
        }, `La réservation de la chambre ${room_rsv.roomId} par Mr / Mme ${room_rsv.name} du ${getFrenchDate(room_rsv.start)} au ${getFrenchDate(room_rsv.end)} est annulée`);
    }, [authSession, reservations, reservation_book.update]);

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
