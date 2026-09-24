"use client";

import React from "react";
import BedRoom from "../types/bedroom";
import { AuthSession } from "../types/employer";
import { bedrooms_datas } from "./room";

type UpdateBedRoom = (roomId: BedRoom.Id, value: {
    power?: BedRoom.Power,
}) => void;

type DataContextType = {
    authSession: AuthSession | null,
    setAuthSession: React.Dispatch<React.SetStateAction<AuthSession | null>>,
    bedRooms: BedRoom.Map,
    updateBedRoom: UpdateBedRoom,
};

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
    const map: BedRoom.Map = Object.fromEntries(
        bedrooms_datas.map((room) => ([room.id, {
            power: "NONE",
            ...room
        }])) );
    const [bedRooms, setBedRooms] = React.useState<BedRoom.Map>(map);

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
            authSession, setAuthSession,
            bedRooms, updateBedRoom,
        }}> { children }
        </dataContext.Provider>
    );
}
