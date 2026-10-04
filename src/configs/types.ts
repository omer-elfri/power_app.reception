import { StageId, toTab } from "../types";
import BedRoom from "../types/bedroom"

import { room_datas } from "./room";
import { room_ctg_datas } from "./room_ctg";

export type RoomData = {
    readonly categories: [
        BedRoom.Category.Id,
        ...BedRoom.Category.Id[],
    ],
    stage: StageId,
}

export type RoomCtgData = {
    name: string,
    price: number,
    option: 'VENT' | 'CLIM',
}

export const room_list = toTab<{[k: string]: RoomData}>(room_datas);
export const room_ctg_list = toTab<{[k: string]: RoomCtgData}>(room_ctg_datas);
