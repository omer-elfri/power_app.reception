"use client";

import React from "react";

import { moves, notifications, restauration } from "../configs/datas";
import { room_ctg_datas } from "../configs/room_ctg";
import { room_datas } from "../configs/room";

import BedRoom from "../types/bedroom";
import Employer, { AuthSession } from "../types/employer";
import { room_ctg_list, room_list, RoomData } from "./types";
import { MoveType, NotificationType, RestaurantType, IssueType, Power, TypeWithId } from "../types";
import { employers_datas } from "../configs/employer";




type DataContextType = {
    analysis: AnalysisType,
    authSession: AuthSession | null,
    setAuthSession: React.Dispatch<React.SetStateAction<AuthSession | null>>,
    bedRooms: BedRoom.Map,
    updateBedRoom: (roomId: BedRoom.Id, datas: UpdateBedRoomValues) => void,

    moves: MoveType[],
    notifications: NotificationType[],
    restauration: RestaurantType[],
};

const dataContext = React.createContext<DataContextType | null>(null);

export function useDataContext() {
    const context = React.useContext(dataContext);

    if (!context) {
        throw new Error("useContext doit être utilisé dans ContextProvider");
    }
    return context;
}





function createNewRoom(room: TypeWithId<RoomData>) {
    const res: BedRoom.Type = {
        connected: false,
        id: room.id as BedRoom.Id,
        power: null,

        check_in: null,
        cleaning: null,
        coming: null,
        price: room.price ?? room_ctg_datas[
            room.categories[0]
        ].price,
        stage: room.stage,
        categories: room.categories,
        issues: [],
    };
    return res;
}

type UpdateBedRoomValues = {
    power?: Power,
    check_in?: Omit<BedRoom.CheckInType, 'start' | 'end'> | null,
    cleaning?: Employer.Id | null,
    coming?: BedRoom.ReservationType,
    issues?: IssueType[],
}

function updateBedRoom1( room: BedRoom.Type,
    { power, check_in, coming, cleaning, issues }: UpdateBedRoomValues,
) {
    if (power !== undefined) room.power = power;
    if (check_in !== undefined) {
        if (check_in) {
            room.check_in = { ...check_in,
                start: new Date(Date.now()),
                end: null,
            };
        } else check_in = null;
    }
    if (cleaning !== undefined) {
        console.log("a", cleaning)
        room.cleaning = (cleaning) ? {
            vallet: cleaning,
            name: employers_datas[cleaning].name,
            start: new Date(Date.now()),
            end: null,
        } : null;
    }
    if (coming !== undefined) room.coming = coming;
    if (issues !== undefined) room.issues = issues;
    room.price = (
        room.check_in?.price ??
        room_datas[room.id].price ??
        room_ctg_datas[
            room.categories[0]
        ].price
    );
    return room;
}







type AnalysisType = {
    powered: BedRoom.Type[],
    solded: BedRoom.Type[],
    free: BedRoom.Type[],
    coming: BedRoom.Type[],
    issues: BedRoom.Type[],
    cleaning: {
        check_in: BedRoom.Type[],
        check_out: BedRoom.Type[],
        total: BedRoom.Type[],
    },
    room_ctgs: { [k in BedRoom.Category.Id]: {
        topSolded: BedRoom.Type[],
        solded: BedRoom.Type[],
        topFree: BedRoom.Type[],
        free: BedRoom.Type[],
        topTotal: BedRoom.Type[],
        total: BedRoom.Type[],
    } },
    going: BedRoom.Type[],
    breakfast: BedRoom.Type[],
}

function getAnalysis(bedRoomTab: BedRoom.Type[]): AnalysisType {
    const statusPerRoomCategory = room_ctg_list.map((room_ctg) => {
        const rooms = bedRoomTab.filter(({ categories }) => (
            categories.includes(room_ctg.id as BedRoom.Category.Id) ) );
        const topRooms = rooms.filter(({ categories }) => (
            categories[0] === room_ctg.id ) );
        return [ room_ctg.id as BedRoom.Category.Id, {
            topSolded: topRooms.filter(room => room.check_in),
            solded: rooms.filter(room => room.check_in),
            topFree: topRooms.filter(room => !room.check_in),
            free: rooms.filter(room => !room.check_in),
            topTotal: topRooms,
            total: rooms,
        } ];
    });
    return {
        powered: bedRoomTab.filter(room => room.power === 'ON'),
        solded: bedRoomTab.filter(room => !!room.check_in),
        free: bedRoomTab.filter(room => !room.check_in),
        coming: bedRoomTab.filter(room => room.coming),
        issues: bedRoomTab.filter(room => room.issues.length > 0),
        cleaning: {
            check_out: bedRoomTab.filter(room => room.cleaning && room.check_in),
            check_in: bedRoomTab.filter(room => room.cleaning && !room.check_in),
            total: bedRoomTab.filter(room => room.cleaning),
        },
        room_ctgs: Object.fromEntries(statusPerRoomCategory),
        going: [],
        breakfast: bedRoomTab.filter(room => room.check_in && room.price >= 16500),
    }
}








export function BedRoomProvider({ children }: { children: React.ReactNode }) {
    const [authSession, setAuthSession] = React.useState<AuthSession | null>(null);
    const [bedRooms, setBedRooms] = React.useState( Object.fromEntries(
        room_list.map((room) => [room.id, createNewRoom(room)]) ) as BedRoom.Map);

    const analysis: AnalysisType = React.useMemo(() => {
        const bedRoomTab = Object.values(bedRooms);
        const analysisRes = getAnalysis(bedRoomTab);
        return analysisRes;
    }, [bedRooms]);

    const updateBedRoom = React.useCallback((
        roomId: BedRoom.Id, datas: UpdateBedRoomValues,
    ) => {
        setBedRooms((bedRooms) => {
            const room = {...bedRooms[roomId]};
            const newRoom = updateBedRoom1(room, datas);
            return ({...bedRooms, [roomId]: newRoom});
        });
    }, [setBedRooms]);

    return (
        <dataContext.Provider value={{
            analysis, moves,
            notifications, restauration,
            authSession, setAuthSession,
            bedRooms, updateBedRoom,
        }}> { children }
        </dataContext.Provider>
    );
}
