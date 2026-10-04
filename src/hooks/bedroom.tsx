"use client";
import React from "react";

import BedRoom from "../types/bedroom";
import { room_ctg_list, room_list } from "../configs/types";
import { RoomState, useRoom } from "./room";

export type AnalysisType = {
    powered: RoomState[],
    solded: RoomState[],
    free: RoomState[],
    coming: RoomState[],
    issues: RoomState[],
    cleaning: {
        check_in: RoomState[],
        check_out: RoomState[],
        total: RoomState[],
    },
    room_ctgs: { [k in BedRoom.Category.Id]: {
        topSolded: RoomState[],
        solded: RoomState[],
        topFree: RoomState[],
        free: RoomState[],
        topTotal: RoomState[],
        total: RoomState[],
    } },
    going: RoomState[],
    breakfast: RoomState[],
}

export function getAnalysis(bedRoomTab: RoomState[]): AnalysisType {

    const statusPerRoomCategory = room_ctg_list.map((room_ctg) => {
        const rooms = bedRoomTab.filter(({ categories }) => (
            categories.includes(room_ctg.id as BedRoom.Category.Id) ) );
        const topRooms = rooms.filter(({ categories }) => (
            categories[0] === room_ctg.id ) );
        return [ room_ctg.id as BedRoom.Category.Id, {
            topSolded: topRooms.filter(room => room.client),
            solded: rooms.filter(room => room.client),
            topFree: topRooms.filter(room => !room.client),
            free: rooms.filter(room => !room.client),
            topTotal: topRooms,
            total: rooms,
        } ];
    });

    return {
        powered: bedRoomTab.filter(room => room.power),
        solded: bedRoomTab.filter(room => !!room.client),
        free: bedRoomTab.filter(room => !room.client),
        coming: bedRoomTab.filter(room => room.coming),
        issues: bedRoomTab.filter(room => room.issue),
        cleaning: {
            check_out: bedRoomTab.filter(room => room.cleaning && room.client),
            check_in: bedRoomTab.filter(room => room.cleaning && !room.client),
            total: bedRoomTab.filter(room => room.cleaning),
        },
        room_ctgs: Object.fromEntries(statusPerRoomCategory),
        going: [],
        breakfast: bedRoomTab.filter(room => room.client && room.client?.start.price >= 16500),
    }
}

export type BedRoomProps = {
    analysis: AnalysisType,
    bedRoomMap: BedRoom.Map,
    bedRoomTab: RoomState[],
}

export function useBedRoom() {

    // const bedRoomTab = React.useMemo<RoomState[]>(() => {
    //     const res = room_list
    //         .map(room => useRoom(room.id))
    //     res.sort( ({id:id1}, {id:id2}) =>
    //         parseInt(id1) - parseInt(id2) );
    //     return res;
    // }, []);

    const bedRoomTab = (() => {
        const res = room_list
            .map(room => useRoom(room.id as BedRoom.Id))
        res.sort( ({id:id1}, {id:id2}) =>
            parseInt(id1) - parseInt(id2) );
        return res;
    })();

    console.log("q")

    const bedRoomMap = React.useMemo<BedRoom.Map>(() => {
        const res = bedRoomTab.map(room => [room.id, room]);
        return Object.fromEntries(res);
    }, [bedRoomTab]);

    const analysis: AnalysisType = React.useMemo(() => {
        return getAnalysis(bedRoomTab);
    }, [bedRoomTab, getAnalysis]);

    return ({
        analysis,
        bedRoomMap,
        bedRoomTab,
    });
}
