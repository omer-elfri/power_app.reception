"use client";

import React from "react";
import { useDataContext } from ".";

import { RestaurantType } from "../types/types";
import BedRoom from "../types/bedroom";
import { getCommonIds, getUniqueIds, unifyIds } from "../tools";
import { TypeWithTrace } from "./bd/useBook";

export type AnalysisType = {
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
    restaurant: {
        paid: TypeWithTrace<RestaurantType>[],
        unPaid: TypeWithTrace<RestaurantType>[],
        total: TypeWithTrace<RestaurantType>[],
    },
    categories: (BedRoom.Category.Type & {
        topSolded: BedRoom.Type[],
        topTotal: BedRoom.Type[],
    })[],
}

export type AnalysisData = {
    analysis: AnalysisType;
    bedRooms: BedRoom.Map;
    bedRoomTab: BedRoom.Type[];
    updateBedRoom: (roomId: BedRoom.Id, props: Partial<BedRoom.Type>) => void;
}

export function useAnalysis(): AnalysisData {
    const {
        bedroom_table, restaurant_book, bedroom_categories,
        isBookedToday, isObsolet,

        cleaning_book, customer_book, getCleaner,
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


    React.useEffect(() => {
        setBedRooms(bedRooms => Object.fromEntries( bedroom_table.list.map(room => {
            const lastClean = room.lastClean?.id ? room.lastClean : null;
            const cleaning = cleaning_book.getRoomId(room.id, cl => !cl.done) ?? null;
            const customer = customer_book.getRoomId(room.id, cu => !cu.end) ?? null;
            const roomRestos = restaurant_book.list.filter(({ customer }) => customer.room_id === room.id);
            const customerRestos = restaurant_book.list.filter(({ customer }) => customer.id === customer?.id);
            const res: BedRoom.Type = {
                ...bedRooms[room.id], ...room,
                lastClean,
                clean: cleaning ? { ...cleaning,
                    valet: getCleaner(cleaning.valet_id)!,
                } : null,
                customer: customer ? { ...customer,
                    restaurant: roomRestos,
                } : null,
                booked: isBookedToday(room.id),
                restaurations: customerRestos,
            }
            return [ room.id, res ];
        }) ) as BedRoom.Map );
    }, [bedroom_table, cleaning_book, customer_book, isBookedToday, restaurant_book]);



    const analysis: AnalysisType = React.useMemo(() => {
        const powered = bedRoomTab.filter(room => room.power);
        const isCleanings = bedRoomTab.filter(room => room.clean);
        const solded = bedRoomTab.filter(room => room.customer);
        const checkOut = bedRoomTab.filter(room => !room.customer);
        const bookeds = bedRoomTab.filter(room =>  isBookedToday(room.id) );
        const issues = bedRoomTab.filter(room => room.issue?.priority === 'high');
        const obsolets = bedRoomTab.filter(room => isObsolet(room.id));
        const critics = unifyIds([issues, obsolets]);
        console.log('obsolets', obsolets)

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
            restaurant: {
                paid: restaurant_book.list.filter(resto => resto.paid),
                unPaid: restaurant_book.list.filter(resto => !resto.paid),
                total: restaurant_book.list,
            },
            categories: bedroom_categories.map((room_ctg) => {
                const topCtgRooms = bedRoomTab.filter(({ category }) => (
                    category.id === room_ctg.id ) );
                return {
                    ...room_ctg,
                    topSolded: topCtgRooms.filter(room => room.customer),
                    topTotal: topCtgRooms,
                };
            }),
        }
    }, [bedRoomTab, bedroom_categories, isObsolet, restaurant_book]);


    return ({ analysis, bedRooms, bedRoomTab, updateBedRoom });
}

