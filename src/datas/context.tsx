"use client";

import React from "react";

import BedRoom from "../types/bedroom";
import { AuthSession } from "../types/employer";
import { room_ctg_datas } from "../configs/room_ctg";
import { room_ctg_list, room_list, RoomData } from "./types";

type UpdateBedRoom = (roomId: BedRoom.Id, value: {
    power?: BedRoom.Power,
    coming?: Object[],
    check_in?: Object | null,
    cleaning?: Object | null,
}) => void;

type DataContextType = {
    analysis: AnalysisType,
    authSession: AuthSession | null,
    setAuthSession: React.Dispatch<React.SetStateAction<AuthSession | null>>,
    bedRooms: BedRoom.Map,
    updateBedRoom: UpdateBedRoom,

    moves: MoveType[],
    notifications: NotificationType[],
    restauration: RestaurantType[],
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

export type NotificationType = {
    time: string,
    roomId: BedRoom.Id,
    label: BedRoom.Status.Label,
    value: string,
}

const notifications: NotificationType[] = [{
    'time': "11:00",
    'roomId': '101',
    'label': 'coming',
    'value': "Lorem ipsum dolor sit amet consectetur.",
}, {
    'time': "13:00",
    'roomId': '101',
    'label': 'sold',
    'value': "Lorem ipsum dolor sit amet consectetur.",
}, {
    'time': "12:00",
    'roomId': '101',
    'label': 'restaurant',
    'value': "Lorem ipsum dolor sit amet consectetur.",
}, {
    'time': "13:00",
    'roomId': '101',
    'label': 'sold',
    'value': "Lorem ipsum dolor sit amet consectetur.",
}, {
    'time': "12:00",
    'roomId': '101',
    'label': 'restaurant',
    'value': "Lorem ipsum dolor sit amet consectetur.",
}, {
    'time': "13:00",
    'roomId': '101',
    'label': 'sold',
    'value': "Lorem ipsum dolor sit amet consectetur.",
}, {
    'time': "12:00",
    'roomId': '101',
    'label': 'restaurant',
    'value': "Lorem ipsum dolor sit amet consectetur.",
}, {
    'time': "13:00",
    'roomId': '101',
    'label': 'sold',
    'value': "Lorem ipsum dolor sit amet consectetur.",
}, {
    'time': "12:00",
    'roomId': '101',
    'label': 'restaurant',
    'value': "Lorem ipsum dolor sit amet consectetur.",
}, {
    'time': "13:00",
    'roomId': '101',
    'label': 'sold',
    'value': "Lorem ipsum dolor sit amet consectetur.",
}, {
    'time': "12:00",
    'roomId': '101',
    'label': 'restaurant',
    'value': "Lorem ipsum dolor sit amet consectetur.",
}, {
    'time': "13:00",
    'roomId': '101',
    'label': 'sold',
    'value': "Lorem ipsum dolor sit amet consectetur.",
}, {
    'time': "12:00",
    'roomId': '101',
    'label': 'restaurant',
    'value': "Lorem ipsum dolor sit amet consectetur.",
}, {
    'time': "13:00",
    'roomId': '101',
    'label': 'sold',
    'value': "Lorem ipsum dolor sit amet consectetur.",
}, {
    'time': "12:00",
    'roomId': '101',
    'label': 'restaurant',
    'value': "Lorem ipsum dolor sit amet consectetur.",
}, {
    'time': "13:00",
    'roomId': '101',
    'label': 'sold',
    'value': "Lorem ipsum dolor sit amet consectetur.",
}, {
    'time': "12:00",
    'roomId': '101',
    'label': 'restaurant',
    'value': "Lorem ipsum dolor sit amet consectetur.",
}, {
    'time': "13:00",
    'roomId': '101',
    'label': 'sold',
    'value': "Lorem ipsum dolor sit amet consectetur.",
}, {
    'time': "12:00",
    'roomId': '101',
    'label': 'restaurant',
    'value': "Lorem ipsum dolor sit amet consectetur.",
}, {
    'time': "13:00",
    'roomId': '101',
    'label': 'sold',
    'value': "Lorem ipsum dolor sit amet consectetur.",
}, {
    'time': "12:00",
    'roomId': '101',
    'label': 'restaurant',
    'value': "Lorem ipsum dolor sit amet consectetur.",
}];

export type RestaurantType = {
    time: string,
    roomId: BedRoom.Id,
    client: string,
    article: string,
    price: number,
}

const restauration: RestaurantType[] = [{
    'time': '10:15',
    'roomId': '101',
    'client': "Client 1",
    'article': "fwesd",
    'price': 20300,
}, {
    'time': '10:15',
    'roomId': '102',
    'client': "Client 1",
    'article': "fwesd",
    'price': 20300,
}, {
    'time': '10:15',
    'roomId': '101',
    'client': "Client 1",
    'article': "fwesd",
    'price': 20300,
}];

export type MoveType = {
    come_at: string,
    roomId: BedRoom.Id,
    sens: 'arrivée' | 'départ',
    client: string,
    go_at: string,
}

const moves: MoveType[] = [{
    'sens': "arrivée",
    'roomId': '101',
    'client': "Mr Smith",
    'come_at': "11:00",
    'go_at': "11:30",
}, {
    'sens': "départ",
    'roomId': '104',
    'client': "Mme Charlotte",
    'come_at': "12:00",
    'go_at': "13:00",
}, {
    'sens': "arrivée",
    'roomId': '101',
    'client': "Mr Smith",
    'come_at': "11:00",
    'go_at': "11:30",
}, {
    'sens': "départ",
    'roomId': '104',
    'client': "Mme Charlotte",
    'come_at': "12:00",
    'go_at': "13:00",
}, {
    'sens': "arrivée",
    'roomId': '101',
    'client': "Mr Smith",
    'come_at': "11:00",
    'go_at': "11:30",
}, {
    'sens': "départ",
    'roomId': '104',
    'client': "Mme Charlotte",
    'come_at': "12:00",
    'go_at': "13:00",
}, {
    'sens': "arrivée",
    'roomId': '101',
    'client': "Mr Smith",
    'come_at': "11:00",
    'go_at': "11:30",
}, {
    'sens': "départ",
    'roomId': '104',
    'client': "Mme Charlotte",
    'come_at': "12:00",
    'go_at': "13:00",
}, {
    'sens': "arrivée",
    'roomId': '101',
    'client': "Mr Smith",
    'come_at': "11:00",
    'go_at': "11:30",
}, {
    'sens': "départ",
    'roomId': '104',
    'client': "Mme Charlotte",
    'come_at': "12:00",
    'go_at': "13:00",
}, {
    'sens': "arrivée",
    'roomId': '101',
    'client': "Mr Smith",
    'come_at': "11:00",
    'go_at': "11:30",
}, {
    'sens': "départ",
    'roomId': '104',
    'client': "Mme Charlotte",
    'come_at': "12:00",
    'go_at': "13:00",
}, {
    'sens': "arrivée",
    'roomId': '101',
    'client': "Mr Smith",
    'come_at': "11:00",
    'go_at': "11:30",
}, {
    'sens': "départ",
    'roomId': '104',
    'client': "Mme Charlotte",
    'come_at': "12:00",
    'go_at': "13:00",
}, {
    'sens': "arrivée",
    'roomId': '101',
    'client': "Mr Smith",
    'come_at': "11:00",
    'go_at': "11:30",
}, {
    'sens': "départ",
    'roomId': '104',
    'client': "Mme Charlotte",
    'come_at': "12:00",
    'go_at': "13:00",
}, {
    'sens': "arrivée",
    'roomId': '101',
    'client': "Mr Smith",
    'come_at': "11:00",
    'go_at': "11:30",
}, {
    'sens': "départ",
    'roomId': '104',
    'client': "Mme Charlotte",
    'come_at': "12:00",
    'go_at': "13:00",
}];



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
                ...room_ctg_datas[ctgId], id: ctgId, }) ) as
                [BedRoom.Category.Type, ...BedRoom.Category.Type[]];
            const price = roomData.price ?? categories[0].price;
            const stage = BedRoom.Stage.stages[room.stage];

            const data: BedRoom.Type = {
                connected: false,
                id: room.id as BedRoom.Id,
                power: null,

                check_in: null,
                check_out: null,
                cleaning: null,
                coming: [],
                price, stage, categories,
                histories: [],
                hs: false,
            };
            return ([room.id, data])
        }) ) as BedRoom.Map;

    const [bedRooms, setBedRooms] = React.useState<BedRoom.Map>(map);

    const analysis: AnalysisType = React.useMemo(() => {
        const roomTab = Object.entries(bedRooms);

        const statusPerRoomCategory = room_ctg_list.map((room_ctg) => [
            room_ctg.id as BedRoom.Category.Id, {
                nbSolded: roomTab.filter(([_,room]) => (room.check_in &&
                    room.categories[0].id === room_ctg.id )).length,
                nbAvailable: roomTab.filter(([_,room]) => (!room.check_in &&
                    room.categories[0].id === room_ctg.id )).length,
            } ] );

        return {
            nbSolded: roomTab.filter(([_,room]) => (room.check_in)).length,
            nbFree: roomTab.filter(([_,room]) => (!room.power)).length,
            nbComing: roomTab.filter(([_,room]) => (room.coming.length > 0)).length,
            nbHs: roomTab.filter(([_,room]) => (room.hs)).length,
            nbCleaning: {
                checkout: roomTab.filter(([_,room]) => (room.cleaning && room.check_in)).length,
                checkin: roomTab.filter(([_,room]) => (room.cleaning && !room.check_in)).length,
            },
            nbPowered: roomTab.filter(([_,room]) => (room.power === 'ON')).length,
            nbGoing: 4,
            nbBreakfast: roomTab.filter(([_,room]) => (room.price >= 16500)).length,
            roomCategories: Object.fromEntries(statusPerRoomCategory) as
                { [k in BedRoom.Category.Id]: {
                    nbSolded: number,
                    nbAvailable: number,
                } },
        }
    }, [bedRooms]);

    const updateBedRoom: UpdateBedRoom = React.useCallback((
        roomId, { power, check_in, coming, cleaning }
    ) => {
        setBedRooms((bedRooms) => {
            const room = {...bedRooms[roomId]};
            if (power !== undefined) room.power = power;
            if (check_in !== undefined) room.check_in = check_in;
            if (coming !== undefined) room.coming = coming;
            if (cleaning !== undefined) room.cleaning = cleaning;
            return ({...bedRooms, [roomId]: room});
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
