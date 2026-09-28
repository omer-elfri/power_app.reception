"use client";

import React from "react";

import BedRoom from "../types/bedroom";
import { AuthSession } from "../types/employer";
import { room_ctg_datas } from "../configs/room_ctg";
import { room_ctg_list, room_list, RoomData } from "./types";

type UpdateBedRoom = (roomId: BedRoom.Id, value: {
    power?: BedRoom.Power,
}) => void;

type DataContextType = {
    analysis: AnalysisType,
    authSession: AuthSession | null,
    setAuthSession: React.Dispatch<React.SetStateAction<AuthSession | null>>,
    bedRooms: BedRoom.Map,
    updateBedRoom: UpdateBedRoom,
};

export type AnalysisType = {
    nbSolded: number,
    nbPowered: number,
    nbComing: number,
    nbGoing: number,
    nbCleaning: {
        checkin: number,
        checkout: number,
    },
    nbBreakfast: number,
    nbHs: number,
    nbFree: number,
    roomCategories: { [k in BedRoom.Category.Id]: {
        nbSolded: number,
        nbAvailable: number,
    } },
}



const dataContext = React.createContext<DataContextType | null>(null);

export function useDataContext() {
    const context = React.useContext(dataContext);

    if (!context) {
        throw new Error("useContext doit être utilisé dans ContextProvider");
    }
    return context;
}

export function BedRoomProvider({ children }: { children: React.ReactNode }) {
    const [authSession, setAuthSession] = React.useState<AuthSession | null>(null);

    const map = Object.fromEntries(
        room_list.map((room) => {
            const roomData = room as RoomData;
            const categories = room.categories.map((ctgId) => ({
                ...room_ctg_datas[ctgId], id: ctgId, }) );
            const price = roomData.price ?? categories[0].price;
            return ([room.id, { ...room,
                id: room.id, power: "NONE",
                stage: BedRoom.Stage.stages[room.stage],
                price, categories,
            }])
        }) ) as BedRoom.Map;

    const [bedRooms, setBedRooms] = React.useState<BedRoom.Map>(map);

    const statusPerRoomCategory = room_ctg_list.map((room_ctg) => [
        room_ctg.id, { nbSolded: 0, nbAvailable: 0, } ] );

    const analysis: AnalysisType = {
        nbSolded: 0,
        nbPowered: 2,
        nbComing: 0,
        nbGoing: 4,
        nbCleaning: {
            checkin: 0,
            checkout: 0,
        },
        nbBreakfast: 0,
        nbHs: 0,
        nbFree: 0,
        roomCategories: Object.fromEntries(statusPerRoomCategory),
    }

    const updateBedRoom: UpdateBedRoom = React.useCallback((
        roomId, { power }
    ) => {
        setBedRooms((bedRooms) => {
            const room = {...bedRooms[roomId]};
            if (power) room.power = power;
            return ({...bedRooms, [roomId]: room});
        });
    }, [setBedRooms]);

    return (
        <dataContext.Provider value={{
            analysis,
            authSession, setAuthSession,
            bedRooms, updateBedRoom,
        }}> { children }
        </dataContext.Provider>
    );
}
