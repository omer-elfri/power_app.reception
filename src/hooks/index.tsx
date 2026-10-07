"use client";

import React from "react";

import { moves_datas, restauration_datas } from "../configs/datas";
import { MoveType, NotificationType, RestaurantType, State, StatusId } from "../types";
import BedRoom from "../types/bedroom";
import Employer from "../types/employer";
import { useAuth } from "./auth";
import { employers_datas } from "../configs/employer";
import { string_object } from "../tools";

type DataContextType = {
    roomPopup: BedRoom.Id | null,
    setRoomPopup: State<BedRoom.Id | null>,
    cleaningPopup: boolean,
    setCleaningPopup: State<boolean>,
    bookingPopup: boolean,
    setBookingPopup: State<boolean>,

    status: StatusId[],
    setStatus: State<StatusId[]>,

    moves: MoveType[],
    setMoves: State<MoveType[]>,
    notifications: HistoryType[],
    restaurations: RestaurantType[],
    setRestaurations: State<RestaurantType[]>,

    histories: HistoryType[],
    addHistory: (label: ActionId, roomId: BedRoom.Id, datas?: Object) => void,
};

export type ActionId = 
    'POWER_ON' |
    'POWER_OFF' |
    'CHECK_IN' |
    'CHECK_OUT' |
    'CLEANING_START' |
    'CLEANING_CANCELED' |
    'CLEANING_DONE' |
    'BOOKED' |
    'BOOKED_CANCELED'

const dataContext = React.createContext<DataContextType | null>(null);

export function useDataContext() {
    const context = React.useContext(dataContext);

    if (!context) {
        throw new Error("useContext doit être utilisé dans ContextProvider");
    }
    return context;
}

export type HistoryType = {
    label: ActionId,
    roomId: BedRoom.Id,
    datas?: Object,
    date: Date,
    receptionnistId: Employer.Id,
}

export function DataProvider({ children }: { children: React.ReactNode }) {
    const { isAuth } = useAuth();
    const [restaurations, setRestaurations] = React.useState(restauration_datas);
    const [moves, setMoves] = React.useState(moves_datas);
    const [histories, setHistories] = React.useState<HistoryType[]>([
        { label: 'POWER_ON', roomId: '003', date: new Date(Date.now()), receptionnistId: 'receptionist1', },
        { label: 'POWER_OFF', roomId: '003', date: new Date(Date.now()), receptionnistId: 'receptionist1', },
        { label: 'POWER_ON', roomId: '003', date: new Date(Date.now()), receptionnistId: 'receptionist1', },
        { label: 'POWER_ON', roomId: '003', date: new Date(Date.now()), receptionnistId: 'receptionist2', },

        // { label: 'BOOKED', roomId: '003', datas: {}, date: new Date(Date.now()), receptionnistId: 'receptionist2', },
        // { label: 'BOOKED_CANCELED', roomId: '003', datas: {}, date: new Date(Date.now()), receptionnistId: 'receptionist2', },
        { label: 'CLEANING_START', roomId: '003', datas: {
            vallet: employers_datas['vallet1'],
        }, date: new Date(Date.now()), receptionnistId: 'receptionist2', },
        { label: 'CLEANING_DONE', roomId: '003', datas: {
            vallet: employers_datas['vallet1'],
        }, date: new Date(Date.now()), receptionnistId: 'receptionist2', },
        { label: 'CLEANING_CANCELED', roomId: '003', datas: {
            vallet: employers_datas['vallet1'],
        }, date: new Date(Date.now()), receptionnistId: 'receptionist2', },
    ]);


    const localStorageKey = 'histories';

    React.useEffect(() => {
        const res = string_object<HistoryType[]>(localStorageKey);
        if (res) setHistories(res);
    }, []);

    React.useEffect(() => {
        localStorage.setItem(localStorageKey, JSON.stringify(histories));
    }, [histories]);




    const notifications = React.useMemo(() => {
        const exludedLabels: ActionId[] = [ 'POWER_ON', 'POWER_OFF' ];
        const res = histories.filter(history => !exludedLabels.includes(history.label))
        return res;
    }, [histories]);


    const [status, setStatus] = React.useState<StatusId[]>([]);
    const [roomPopup, setRoomPopup] = React.useState<BedRoom.Id | null>(null);
    const [cleaningPopup, setCleaningPopup] = React.useState(false);
    const [bookingPopup, setBookingPopup] = React.useState(false);

    const addHistory = React.useCallback((label: ActionId, roomId: BedRoom.Id, datas?: Object) => {
        const authSession = isAuth();
        setHistories(histories => [{
            label, roomId, datas,
            date: new Date(Date.now()),
            receptionnistId: authSession.id,
        }, ...histories])
    }, [isAuth]);

    return (
        <dataContext.Provider value={{
            moves,
            setMoves,
            notifications,
            restaurations,
            setRestaurations,

            histories,
            addHistory,

            status, setStatus,
            roomPopup, setRoomPopup,
            cleaningPopup, setCleaningPopup,
            bookingPopup, setBookingPopup,
        }}> { children }
        </dataContext.Provider>
    );
}

