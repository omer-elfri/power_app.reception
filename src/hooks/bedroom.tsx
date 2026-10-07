"use client";
import React from "react";

import { room_ctg_list, room_list, RoomData } from "../configs/types";
import { employers_datas } from "../configs/employer";
import BedRoom from "../types/bedroom";
import { toTab, TypeWithId } from "../types";
import Employer from "../types/employer";
import { useDataContext } from ".";
import { string_object } from "../tools";

export type AnalysisType = {
    powered: BedRoom.Type[],
    solded: BedRoom.Type[],
    free: BedRoom.Type[],
    coming: {
        free: BedRoom.Type[],
        total: BedRoom.Type[],
    },
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

export type BedRoomReturn = {
    analysis: AnalysisType,
    bedRooms: BedRoom.Map,
    bedRoomTab: BedRoom.Type[],
    updateBedRoom: (
        roomId: BedRoom.Id,
        props: Partial<BedRoom.Type>
    ) => void,

    switch_power: (roomId: BedRoom.Id, power: boolean) => void,
    check_in: (roomId: BedRoom.Id, props: CheckInProps) => void,
    check_out: (roomId: BedRoom.Id, price?: number) => void,
    clean: (roomId: BedRoom.Id,  valletId: Employer.Id, description?: string) => void,
    cancel_clean: (roomId: BedRoom.Id) => void,
}


export function getAnalysis(bedRoomTab: BedRoom.Type[]): AnalysisType {

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
        coming: {
            free: bedRoomTab.filter(room => room.coming && !room.client),
            total: bedRoomTab.filter(room => room.coming),
        },
        issues: bedRoomTab.filter(room => room.issue),
        cleaning: {
            check_out: bedRoomTab.filter(room => room.cleaning && room.client),
            check_in: bedRoomTab.filter(room => room.cleaning && !room.client),
            total: bedRoomTab.filter(room => room.cleaning),
        },
        room_ctgs: Object.fromEntries(statusPerRoomCategory),
        going: [],
        breakfast: bedRoomTab.filter(room => room.client && room.client?.price >= 16500),
    }
}

function createNewRoom(room: TypeWithId<RoomData>): TypeWithId<BedRoom.Type> {
    return ({
        connected: false,
        id: room.id as BedRoom.Id,
        stage: room.stage,
        categories: room.categories,
        description: "",

        power: null,
        client: null,
        coming: null,
        cleaning: null,
        issue: null,
    });
}









const bedRoomContext = React.createContext<BedRoomReturn | null>(null);

export function useBedRoom() {
    const context = React.useContext(bedRoomContext);

    if (!context) {
        throw new Error("useBedRoomContext doit être utilisé dans BedRoomProvider");
    }
    return context;
}

export function BedRoomProvider({ children }: { children: React.ReactNode }) {
    const { addHistory } = useDataContext();
    const localStorageKey = 'bedrooms';

    const [bedRooms, setBedRooms] = React.useState<BedRoom.Map>( Object.fromEntries(
        room_list.map(room => [room.id, createNewRoom(room)]) ) as BedRoom.Map );

    const bedRoomTab = React.useMemo<BedRoom.Type[]>(() => {
        return toTab(bedRooms)
            .sort( ({id:id1}, {id:id2}) => parseInt(id1) - parseInt(id2) );
    }, [bedRooms]);

    React.useEffect(() => {
        const res = string_object<BedRoom.Map>(localStorageKey);
        if (res) setBedRooms(res);
    }, []);

    React.useEffect(() => {
        localStorage.setItem(localStorageKey, JSON.stringify(bedRooms));
    }, [bedRooms]);

    const analysis: AnalysisType = React.useMemo(() => {
        return getAnalysis(bedRoomTab);
    }, [bedRoomTab]);

    const updateBedRoom = React.useCallback( (
        roomId: BedRoom.Id,
        props: Partial<BedRoom.Type>,
        handler?: (room: BedRoom.Type) => void,
    ) => {
        setBedRooms(datas => {
            const oldRoom = datas[roomId];
            const newRoom = { ...oldRoom, ...props, };
            handler?.(oldRoom);
            return { ...datas, [roomId]: newRoom };
        });
    }, []);

    const switch_power = React.useCallback((roomId: BedRoom.Id, power: boolean) => {
        const room = bedRooms[roomId];
        if (!power && room.power === null)
            throw Error("L'état de power n'est pas défini");
        updateBedRoom(roomId, { power });
        addHistory(power ? 'POWER_ON' : 'POWER_OFF', room.id, {
            name: room.cleaning?.vallet.name ?? room.client?.name ?? null,
            type: room.cleaning ? 'vallet' : room.client ? 'client' : null,
        });
    }, [updateBedRoom]);

    const check_in = React.useCallback((roomId: BedRoom.Id, props: CheckInProps) => {
        const res: BedRoom.CheckInType = {
            date: new Date(Date.now()),
            sexe: props.sexe ?? 'Mr',
            name: props.name,
            description: props.description ?? "",
            price: props.price,
        };
        updateBedRoom(roomId, { client: res });
        addHistory('CHECK_IN', roomId, res);
    }, [updateBedRoom]);

    const check_out = React.useCallback((roomId: BedRoom.Id) => {
        updateBedRoom(roomId, { client: null }, room => {
            console.log("check_out")
            if (!room.client)
                throw Error(`La chambre ${roomId} n'est pas check in`);
            addHistory('CHECK_OUT', roomId, room.client);
        });
    }, [updateBedRoom]);
    
    const clean = React.useCallback((roomId: BedRoom.Id, valletId: Employer.Id, description?: string) => {
        const res = {
            start: new Date(Date.now()),
            vallet: employers_datas[valletId],
            description: description ?? "",
            end: null,
        };
        updateBedRoom(roomId, { cleaning: res });
        addHistory('CLEANING_START', roomId, res);
    }, [updateBedRoom]);

    const cancel_clean = React.useCallback((roomId: BedRoom.Id) => {
        updateBedRoom(roomId, { cleaning: null }, room => {
            const res = room.cleaning;
            if (!res)
                throw Error(`La chambre ${roomId} n'est pas en nettoyage`);
            res.end = new Date(Date.now());
            addHistory('CLEANING_CANCELED', roomId, res);
        });
    }, [updateBedRoom]);

    return (
        <bedRoomContext.Provider value={{
            analysis,
            bedRooms,
            bedRoomTab,
            updateBedRoom,

            switch_power,
            check_in, check_out,
            clean, cancel_clean,
        }}> { children }
        </bedRoomContext.Provider>
    );
}











export type CheckInProps = {
    sexe?: 'Mr' | 'Mme',
    name: string,
    price: number,
    description?: string,
};

export type InfosType = {
    powered: string,
    isSolded: boolean,
    cleaning: string,
    clientName: string | null,
    issueIcon: React.ReactNode | null,
    categoryNames: string,
}
