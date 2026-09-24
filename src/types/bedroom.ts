import { bedroom_ctgs_datas, Data as RoomCtgData } from "../datas/room_ctg";
import { bedrooms_datas, Data as RoomData } from "../datas/room";

namespace BedRoom {

    export type Id = typeof bedrooms_datas[number]['id'];

    export namespace Category {

        const ids = Object.keys(bedroom_ctgs_datas);
        export type Id = typeof ids[number];

        export type Type = {
        } & RoomCtgData;
    }

    export type Type = {
        status?: Status,
        power: Power,
        // client?: Customer.Type,
        history?: History[],
    } & RoomData;

    export function is(roomId: string): roomId is Id {
        return bedrooms_datas.some(room => room.id === roomId);
    }

    export type Map = {[k in Id]: Type};

    export type Power = 'ON' | 'OFF' | 'NONE';

    export type Status = (
        'GUEST'
        | 'SOLD'
        | 'CLEANING'
        | 'FREE'
    );

    export type Action = (
        'GUEST_IN'
        | 'GUEST_OUT'
        | 'CHECK_IN'
        | 'CLEAN_START'
        | 'CLEAN_END'
        | 'CHECK_OUT'
        | 'POWER_ON'
        | 'POWER_OFF'
    );

    export type History = {
        // user: Collaborator.Id,
        action: Action,
        start: Date,
        end?: Date,
    };
}

export default BedRoom;
