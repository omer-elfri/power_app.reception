"use client";

import React, { useCallback, useContext, useState } from "react";
import { bedRoomIds, PowerStatus, type BedRoomId, BedRoomMap, type BedRoomType } from "./type";

type RoomContextType = {
    bedRooms: BedRoomMap;
    updateBedRoom: UpdateBedRoomCallback;
};

export type UpdateBedRoomCallback = (
    roomId: BedRoomId,
    value: {
        power?: PowerStatus,
    },
) => void

export const BedRoomContext = React.createContext<RoomContextType | null>(null);

export function BedRoomProvider({ children }: { children: React.ReactNode }) {

    const [bedRooms, setBedRooms] = useState<BedRoomMap>(
        Object.fromEntries( bedRoomIds
            .map( (bedRoomId) => [ bedRoomId, {
                id: bedRoomId,
                power: "DISCONNECTED",
            }] )
        ) as BedRoomMap );

    const updateBedRoom: UpdateBedRoomCallback = useCallback((roomId, { power }) => {
        setBedRooms((bedRooms: BedRoomMap) => {
            const oldRoom: BedRoomType = bedRooms[roomId];
            const newRoom = {...oldRoom,
                power: (power !== undefined) ? power : oldRoom.power,
            };
            return ({...bedRooms, [roomId]: newRoom});
        });
    }, [setBedRooms]);

    return (
        <BedRoomContext.Provider value={{ bedRooms, updateBedRoom }}>
            {children}
        </BedRoomContext.Provider>
    );
}


export function useBedRoom() {
    const context = useContext(BedRoomContext);

    if (!context) {
        throw new Error("useRooms doit être utilisé dans RoomProvider");
    }
    return context;
}
