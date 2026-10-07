"use client";

import React from "react";

import BedRoom from "../types/bedroom";
import Employer from "../types/employer";
import { useAuth } from "./auth";
import { employers_datas } from "../configs/employer";
import { useDataContext } from ".";
import { useBedRoom } from "./bedroom";
import { string_object } from "../tools";

export type ReservationRoomDetails = {
    roomId: BedRoom.Id,
    start: Date,
    end: Date,
}

export type ReservationType = {
    client: string,
    rooms: ReservationRoomDetails[],
    description?: string,
    booker: {
        date: Date,
        receptionnist: Employer.Type,
    },
    cancel?: {
        date: Date,
        receptionnist: Employer.Type,
    },
}

export type ReservationRoom = ReservationRoomDetails & {
    rsv: ReservationType,
    status: ReservationRoomStatus,
};


type ReservationRoomStatus = "annulé" | "a venir" | "dépassé" | "en cours";

type ReservationProps = Omit<ReservationType, 'booker' | 'cancel'> & { date?: Date };

export type ReservationReturn = {
    reservations: ReservationType[],
    currents: ReservationRoom[],
    daily: ReservationRoom[],
    isBooked: (roomId: BedRoom.Id, date?: Date) => ReservationRoom | null,
    add: (props: ReservationProps) => void,
    cancel: (id: number) => void,
    getStatus: (
        data: ReservationType,
        room: ReservationRoomDetails,
    ) => ReservationRoomStatus,
    getInPeriod: (dateStart: Date, dateEnd?: Date) => ReservationRoom[],
}












const reservationContext = React.createContext<ReservationReturn | null>(null);

export function useReservation() {
    const context = React.useContext(reservationContext);

    if (!context) {
        throw new Error("useReservationContext doit être utilisé dans ReservationProvider");
    }
    return context;
}

export function ReservationProvider({ children }: { children: React.ReactNode }) {
    const { isAuth } = useAuth();
    const [datas, setDatas] = React.useState<ReservationType[]>([]);
    const { updateBedRoom } = useBedRoom();
    const localStorageKey = 'reservations';

    React.useEffect(() => {
        const res = string_object<ReservationType[]>(localStorageKey);
        if (res) setDatas(res);
    }, []);

    React.useEffect(() => {
        localStorage.setItem(localStorageKey, JSON.stringify(datas));
    }, [datas]);


    React.useEffect(() => {
        const intervalId = setInterval(() => {
            setDatas(datas => [...datas]);
        }, 60*60*1000);
        return () => clearInterval(intervalId);
    }, []);


    
    const getStatus = React.useCallback((
        data: ReservationType,
        room: ReservationRoomDetails,
    ) => {
        const now = new Date(Date.now());
        return (
            (data.cancel) ? "annulé" :
            (room.start > now) ? "a venir" :
            (now > room.end) ? "dépassé" :
            "en cours"
        );
    }, []);
    

    const allRooms = React.useMemo(() => {
        console.log("datas 2", datas);
        const res: ReservationRoom[] = datas
            .flatMap(data => data.rooms.map(room => ({
                ...room, rsv: data,
                status: getStatus(data, room),
            }) ));
        return res;
    }, [datas]);

    const currents = React.useMemo(() => {
        return allRooms.filter(data => (
            data.status === 'en cours' ||
            data.status === 'a venir'
        ));
    }, [allRooms]);

    const daily = React.useMemo(() => {
        return allRooms.filter(({status}) => status === 'en cours');
    }, [allRooms]);

    const getInPeriod = React.useCallback((dateStart: Date, dateEnd?: Date) => {
        dateEnd = dateEnd ?? new Date(dateStart.getTime() + 60*60*24*1000);
        return currents
            .filter( ({start, end}) => (start < dateStart && dateEnd < end) );
    }, [currents]);
    

    React.useEffect(() => {
        daily.forEach((rsv) => {
            updateBedRoom(rsv.roomId, { coming: rsv });
        });
    }, [daily, updateBedRoom]);

    const isBooked = React.useCallback((roomId: BedRoom.Id, date?: Date) => {
        return daily.find(rsv => rsv.roomId === roomId) ?? null;
    }, [daily]);

    const add = React.useCallback((props: ReservationProps) => {
        const authSession = isAuth();
        setDatas((reservations) => {
            const res = { ...props,
                booker: {
                    date: props.date ?? new Date(Date.now()),
                    receptionnist: employers_datas[authSession.id],
                }
            };
            return [ res, ...reservations ];
        });
    }, [isAuth]);

    const cancel = React.useCallback((id: number) => {
        setDatas((reservations) => {
            if (id >= reservations.length)
                throw Error("La réservation n'existe pas");
            const res = [...reservations]
            res[id-1] = { ...res[id-1], cancel: {
                date: new Date(Date.now()),
                receptionnist: employers_datas['receptionist1'],
            } };
            // res.splice(id-1, 1);
            return res;
        });
    }, []);



    return (
        <reservationContext.Provider value={{
            reservations: datas, currents, daily, isBooked, add, cancel, getStatus, getInPeriod,
        }}> { children }
        </reservationContext.Provider>
    );
}
