"use client";

import React from "react";

import { moves_datas, notifications_datas, restauration_datas } from "../configs/datas";
import { MoveType, NotificationType, RestaurantType, State, StatusId } from "../types";
import BedRoom from "../types/bedroom";
import { BedRoomProps, useBedRoom } from "./bedroom";

type DataContextType = Omit<BedRoomProps, 'bedRoomMap'> & {
    bedRooms: BedRoom.Map,

    roomPopup: BedRoom.Id | null,
    setRoomPopup: State<BedRoom.Id | null>,
    cleaningPopup: boolean,
    setCleaningPopup: State<boolean>,
    bookingPopup: boolean,
    setBookingPopup: State<boolean>,

    status: StatusId[],
    setStatus: State<StatusId[]>,

    moves: MoveType[],
    notifications: NotificationType[],
    restaurations: RestaurantType[],
};

const dataContext = React.createContext<DataContextType | null>(null);

export function useDataContext() {
    const context = React.useContext(dataContext);

    if (!context) {
        throw new Error("useContext doit être utilisé dans ContextProvider");
    }
    return context;
}

export function DataProvider({ children }: { children: React.ReactNode }) {
    const bedRoomProps = useBedRoom();
    const [notifications, setNotifications] = React.useState(notifications_datas);
    const [restaurations, setRestaurations] = React.useState(restauration_datas);
    const [moves, setMoves] = React.useState(moves_datas);

    const [status, setStatus] = React.useState<StatusId[]>([]);
    const [roomPopup, setRoomPopup] = React.useState<BedRoom.Id | null>(null);
    const [cleaningPopup, setCleaningPopup] = React.useState(false);
    const [bookingPopup, setBookingPopup] = React.useState(false);

    return (
        <dataContext.Provider value={{
            ...bedRoomProps,
            bedRooms: bedRoomProps.bedRoomMap,

            moves,
            notifications,
            restaurations,

            status, setStatus,
            roomPopup, setRoomPopup,
            cleaningPopup, setCleaningPopup,
            bookingPopup, setBookingPopup,
        }}> { children }
        </dataContext.Provider>
    );
}

