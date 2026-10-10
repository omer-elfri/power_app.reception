import { StageId } from "../types";
import { toTab } from "../tools";
import BedRoom from "../types/bedroom"

import { room_datas, roomIds } from "./room";
import { room_ctg_datas } from "./room_ctg";

export type RoomId = typeof roomIds[number];

export type RoomData = {
    readonly categories: [
        BedRoom.Category.Id,
        ...BedRoom.Category.Id[],
    ],
    stage: StageId,
    description?: string,
}

export type RoomCtgData = {
    name: string,
    price: number,
    option: 'VENT' | 'CLIM',
}

export const room_list = toTab<{[k: string]: RoomData}>(room_datas);
export const room_ctg_list = toTab<{[k: string]: RoomCtgData}>(room_ctg_datas);
