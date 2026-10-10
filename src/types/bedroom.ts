import { room_ctg_datas } from "../configs/room_ctg";
import { roomIds } from "../configs/room";
import { RoomData } from "../configs/types";
import { CheckInType, CleanType, ReservationType, RestaurantType, StageId, TypeWithId, TypeWithTrace } from ".";

namespace BedRoom {
    export type Id = typeof roomIds[number];

    export type Map = {[k in Id]: BedRoom.Type};

    export namespace Category {
        export type Id = keyof typeof room_ctg_datas;

        export type Type = {
            id: Id,
            name: string,
            price: number,
            option: 'VENT' | 'CLIM',
        };
    }

    export type Type = {
        id: Id,
        stage: StageId,
        categories: [
            Category.Id,
            ...Category.Id[],
        ],
        description?: string,

        connected: boolean,
        power: boolean | null,

        checkIn: TypeWithTrace<CheckInType> | null,
        booked: TypeWithTrace<ReservationType> | null,
        cleaner: TypeWithTrace<CleanType> | null,
        restauration: TypeWithTrace<RestaurantType>[],
        issue: IssueType | null,
    }

    export type IssueType = {
        priority: 'low' | 'medium' | 'high',
        message: string,
    }

    export function create(room: TypeWithId<RoomData>): BedRoom.Type {
        return ({
            id: room.id as BedRoom.Id,
            stage: room.stage,
            categories: room.categories,
            description: "",
    
            connected: false,
            power: null,

            checkIn: null,
            booked: null,
            cleaner: null,
            issue: null,
            restauration: [],
        });
    }
    
}

export default BedRoom;
