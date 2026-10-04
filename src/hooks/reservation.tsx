"use client";

import React from "react";

import BedRoom from "../types/bedroom";
import Employer from "../types/employer";
import { useAuth } from "./auth";
import { employers_datas } from "../configs/employer";

type ReservationRoomDetails = {
    roomId: BedRoom.Id,
    start: Date,
    end: Date,
}

type ReservationType = {
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

export type ReservationRoom = ReservationRoomDetails & Omit<ReservationType, 'rooms'>;




type ReservationProps = Omit<ReservationType, 'booker' | 'cancel'>;

export type ReservationReturn = {
    currents: ReservationRoom[],
    daily: ReservationRoom[],
    isBooked: (roomId: BedRoom.Id, date?: Date) => ReservationRoom | null,
    add: (props: ReservationProps) => void,
    cancel: (id: number) => void,
}

export function useReservation(): ReservationReturn {
    const { isAuth } = useAuth();
    const [datas, setDatas] = React.useState<ReservationType[]>([]);

    const currents = React.useMemo(() => {
        const res = datas
            .filter(data => !data.cancel)
            .flatMap(({rooms, ...data}) =>
                rooms.map(room => ({ ...data, ...room, }) ));
        return res;
    }, [datas]);

    const getInPeriod = React.useCallback((date?: Date) => {
        date = date ?? new Date(Date.now());
        const res = currents
            .filter(({start, end}) => (
                start.getTime() < date.getTime() &&
                date.getTime() < end.getTime()
            ));
        return res;
    }, [currents]);
    

    const daily = React.useMemo(getInPeriod, [getInPeriod]);

    const isBooked = React.useCallback((roomId: BedRoom.Id, date?: Date) => {
        return getInPeriod(date).find(rsv => rsv.roomId === roomId) ?? null;
    }, [getInPeriod]);

    const add = React.useCallback((props: ReservationProps) => {
        const authSession = isAuth();
        setDatas((reservations) => {
            reservations.unshift({
                ...props,
                booker: {
                    date: new Date(Date.now()),
                    receptionnist: employers_datas[authSession.id],
                }
            });
            return reservations;
        });
    }, []);

    const cancel = React.useCallback((id: number) => {
        setDatas((reservations) => {
            if (id < reservations.length - 1)
                throw Error("La réservation n'existe pas");
            delete reservations[id];
            return reservations;
        });
    }, []);

    return ({ currents, daily, isBooked, add, cancel, });
}
