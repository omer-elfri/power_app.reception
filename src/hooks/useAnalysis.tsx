'use client';

import React from "react";
import { useDataContext } from ".";

import { ReservationType, RestaurantType } from "../types/types";
import BedRoom from "../types/bedroom";
import { getCommonIds, getUniqueIds, unifyIds } from "../tools";
import { TypeWithTrace } from "./useBook";

export type AnalysisType = {
    solded: BedRoom.Type[],
    available: BedRoom.Type[],
    free: BedRoom.Type[],
    powered: BedRoom.Type[],
    issues: BedRoom.Type[],
    critics: BedRoom.Type[],
    cleaning: {
        total: BedRoom.Type[],
        sold: BedRoom.Type[],
        free: BedRoom.Type[],
        obsolets: BedRoom.Type[],
    },
    coming: {
        total: BedRoom.Type[],
        sold: BedRoom.Type[],
        free: BedRoom.Type[],
    },
    restaurant: {
        total: TypeWithTrace<RestaurantType>[],
        paid: TypeWithTrace<RestaurantType>[],
        unPaid: TypeWithTrace<RestaurantType>[],
    },
    categories: (BedRoom.Category.Type & {
        topSolded: BedRoom.Type[],
        topTotal: BedRoom.Type[],
    })[],
}

export type AnalysisContext = {
    analysis: AnalysisType;
    bedRooms: BedRoom.Map;
    bedRoomTab: BedRoom.Type[];
    updateBedRoom: (roomId: BedRoom.Id, props: Partial<BedRoom.Type>) => void;
    isObsolet: (roomId: string) => boolean,
    
    getBookedPeriod: (start?: Date, end?: Date | null) => TypeWithTrace<ReservationType>[],
    isBookedToday: (roomId: BedRoom.Id) => TypeWithTrace<ReservationType> | null,
}

export function AnalysisProvider({ children }: { children: React.ReactNode }) {
    const {
        bedroom_table, bedroom_categories,
        cleaning_book, customer_book, reservation_book, restaurant_book,
    } = useDataContext();

    const [bedRooms, setBedRooms] = React.useState<BedRoom.Map>({});

    const bedRoomTab = React.useMemo<BedRoom.Type[]>(() => {
        return Object.values(bedRooms)
            .sort( (a, b) => parseInt(a.name) - parseInt(b.name) );
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


    const isObsolet = React.useCallback((roomId: BedRoom.Id) => {
        const obsoletDay = new Date(Date.now() - 3*24*60*60*1000);
        const room = bedRooms[roomId];
        if (!room) return false;
        const customer = customer_book.getRoomId(roomId);

        if (!room.clean) return false;
        if (!room.clean.done) return false;
        if (room.clean.done < obsoletDay) return true;
        if (customer?.end && room.clean.done < customer.end) return true;
        return false;
    }, [bedRooms, customer_book]);
    




    const getBookedPeriod = React.useCallback((start?: Date, end?: Date | null) => {
        start ??= new Date();
        start.setHours(0, 0, 0, 0);
        end ??= new Date(start.getTime() + 24*60*60*1000);
        end.setHours(13, 0, 0, 0);
        return reservation_book.list.filter(rsv => rsv.start_date < end && start < rsv.end_date);
    }, [reservation_book.list]);

    const isBookedToday = React.useCallback((roomId: BedRoom.Id) => {
        const start = new Date();
        const comingToday = getBookedPeriod(start);
        return comingToday.find(rsv => rsv.room_id === roomId) ?? null;
    }, [getBookedPeriod]);



    React.useEffect(() => {
        setBedRooms(bedRooms => Object.fromEntries( bedroom_table.list.map(room => {
            const cleaning = cleaning_book.getRoomId(room.id, clean => !clean.done) ?? null;
            const lastClean = room.lastClean?.id ? room.lastClean : null;
            const customer = customer_book.getRoomId(room.id, client => !client.end) ?? null;
            const roomRestos = restaurant_book.list.filter(({ customer }) => customer?.room_id === room.id);
            const res: BedRoom.Type = {
                ...(bedRooms[room.id] ?? {}), ...room,
                cleaning, lastClean, clean: cleaning ?? lastClean,
                customer: customer ? { ...customer, restaurant: roomRestos, } : null,
                booked: isBookedToday(room.id),
            }
            return [ room.id, res ];
        }) ) as BedRoom.Map );
    }, [bedroom_table, cleaning_book, customer_book, isBookedToday, restaurant_book]);



    const analysis: AnalysisType = React.useMemo(() => {
        const powered = bedRoomTab.filter(room => room.power);
        const inCleaning = bedRoomTab.filter(room => room.cleaning);
        const solded = bedRoomTab.filter(room => room.customer);
        const checkOut = bedRoomTab.filter(room => !room.customer);
        const bookeds = bedRoomTab.filter(room =>  isBookedToday(room.id) );
        const issues = bedRoomTab.filter(room => room.issue?.priority === 'high');
        const obsolets = bedRoomTab.filter(room => isObsolet(room.id));
        const critics = unifyIds([issues, obsolets]);

        return {
            powered, solded, issues, critics,
            free: getUniqueIds(bedRoomTab, unifyIds([ solded, bookeds, inCleaning, issues ]) ),
            available: getUniqueIds(bedRoomTab, unifyIds([ solded, issues ]) ),
            cleaning: {
                total: inCleaning,
                sold: getCommonIds([inCleaning, solded]),
                free: getCommonIds([inCleaning, checkOut]),
                obsolets,
            },
            coming: {
                total: bookeds,
                sold: getCommonIds([bookeds, solded]),
                free: getCommonIds([bookeds, checkOut]),
            },
            restaurant: {
                paid: restaurant_book.list.filter(resto => resto.paid),
                unPaid: restaurant_book.list.filter(resto => !resto.paid),
                total: restaurant_book.list,
            },
            categories: bedroom_categories.map((room_ctg) => {
                const topCtgRooms = bedRoomTab.filter(({ category_id }) => (
                    category_id === room_ctg.id ) );
                return {
                    ...room_ctg,
                    topSolded: topCtgRooms.filter(room => room.customer),
                    topTotal: topCtgRooms,
                };
            }),
        }
    }, [bedRoomTab, bedroom_categories, isObsolet, restaurant_book]);


    return (
        <analysisContext.Provider value={{
            analysis,
            bedRooms, bedRoomTab,
            updateBedRoom, isObsolet,
            isBookedToday, getBookedPeriod,
        }}> { children }
        </analysisContext.Provider>
    );
}

const analysisContext = React.createContext<AnalysisContext | null>(null);

export function useAnalysis() {
    const context = React.useContext(analysisContext);
    if (!context)
        throw new Error("useAnalysisContext doit être utilisé dans AnalysisProvider");
    return context;
}

