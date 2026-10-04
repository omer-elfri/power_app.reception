"use client";

import React from "react";

import { RoomData } from "../configs/types";
import { room_datas } from "../configs/room";
import { employers_datas } from "../configs/employer";

import { useAuth } from "./auth";
import Employer from "../types/employer";
import BedRoom from "../types/bedroom";
import { ReservationRoom, useReservation } from "./reservation";
import { MdError, MdWarning } from "react-icons/md";
import { room_ctg_datas } from "../configs/room_ctg";

export type RoomState = BedRoom.Type & {
    infos: InfosType,
    update: (datas: Partial<BedRoom.Type>) => void,
    coming: ReservationRoom | null,
    switchPower: (power: BedRoom.Power) => void,
    check_in: (props: CheckInProps) => void,
    check_out: (price?: number,) => void,
    clean: (
        valletId: Employer.Id,
        description?: string,
    ) => void,
    cancel_clean: () => void,
}

export function useRoom(roomId: BedRoom.Id): RoomState {
    const { isAuth } = useAuth();
    const { isBooked } = useReservation();
    const [datas, setDatas] = React.useState<BedRoom.Type>(
        createNewRoom(roomId, room_datas[roomId]) );

    function createNewRoom(roomId: BedRoom.Id, room: RoomData): BedRoom.Type {
        return {
            connected: false,
            id: roomId,
            stage: room.stage,
            categories: room.categories,
            description: "",

            power: null,
            client: null,
            cleaning: null,
            issue: null,
        };
    }

    const coming = React.useMemo(() => {
        return isBooked(roomId);
    }, []);

    const update = React.useCallback((props: Partial<BedRoom.Type>) => {
        console.log("z")
        setDatas((datas) => {
            let newRoom = {...datas, ...props};
            console.log("newRoom", Object.keys(props), newRoom.cleaning)
            return newRoom;
        });
        console.log("qqqz")
    }, [setDatas]);

    const switchPower = React.useCallback((power: BedRoom.Power) => {
        update({ power });
    }, [update]);

    const check_in = React.useCallback((props: CheckInProps) => {
        const authSession = isAuth();
        update({ client: {
            sexe: props.sexe ?? 'Mr',
            name: props.name,
            description: props.description ?? "",
            start: {
                date: new Date(Date.now()),
                price: props.price,
                receptionnist: employers_datas[authSession.id],
            },
            end: null,
        } });
    }, [datas, isAuth, update]);

    const check_out = React.useCallback((price?: number) => {
        const authSession = isAuth();
        if (!datas.client)
            throw Error("La chambre n'est pas check in");
        update({ client: {
            ...datas.client,
            end: {
                date: new Date(Date.now()),
                price: price ?? 0,
                employer: employers_datas[authSession.id],
            },
        } });
    }, [datas, isAuth, update]);
    
    const clean = React.useCallback(( valletId: Employer.Id, description?: string ) => {
        if (roomId === '104')
            console.log('clean', datas.cleaning);
        const authSession = isAuth();
        console.log("a")
        update({ cleaning: {
            vallet: employers_datas[valletId],
            description: description ?? "",
            start: {
                date: new Date(Date.now()),
                receptionnist: employers_datas[authSession.id],
            },
            end: null,
        } });
        console.log("b")
    }, [datas, update]);

    React.useEffect(() => {
        if (roomId === '104')
            console.log(roomId, datas.cleaning);
    }, [roomId, datas]);

    const cancel_clean = React.useCallback(() => {
        const authSession = isAuth();
        if (!datas.cleaning)
            throw Error("La chambre n'est pas en nettoyage");
        update({ cleaning: {
            ...datas.cleaning,
            end: {
                date: new Date(Date.now()),
                employer: employers_datas[authSession.id],
            },
        } });
    }, [datas, update]);


    const infos = React.useMemo((): InfosType => {
        const powered = (datas.power) ? "Allumée" : (datas.power === false) ? "Éteinte" : "...";
        const isSolded = !!datas.client;
    
        const cleaning = datas.cleaning?.end ? "Propre" : datas.cleaning ? datas.cleaning.vallet.name : "Non";
        const clientName = datas.client?.name ?? coming?.client ?? null;
        const issueIcon =
            (datas.issue?.priority === 'high') ? 
                <MdError size={15} className="text-red-600" /> :
            (datas.issue?.priority === 'medium') ?
                <MdWarning size={15} className="text-yellow-600" /> :
            (datas.issue?.priority === 'low') ?
                <MdWarning size={15} className="text-yellow-600" /> :
            null;
        const categoryNames = datas.categories
            .map((ctgId) => ({ id: ctgId, ...room_ctg_datas[ctgId] }) )
            .map(({ name }) => name ).join(", ");
        return ({ powered, isSolded, cleaning, clientName, issueIcon, categoryNames });
    }, [datas, coming]);
    

    // bedRooms['003'].book({ client: "Teazer", name: "Foast", start: new Date(Date.now()), nuitee: 3, });

    return ({
        infos,
        ...datas, update,
        coming,
        switchPower,
        check_in, check_out,
        clean, cancel_clean,
    });
}


type CheckInProps = {
    sexe?: 'Mr' | 'Mme',
    name: string,
    price: number,
    description?: string,
};

type InfosType = {
    powered: string,
    isSolded: boolean,
    cleaning: string,
    clientName: string | null,
    issueIcon: React.ReactNode | null,
    categoryNames: string,
}
