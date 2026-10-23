import { RoomData } from "../configs/room";
import { CleanType, CustomerType, ReservationType, RestaurantType } from "./types";
import { PriorityId, TypeWithTrace } from "./index";

export const stages = [ "Rez de chaussée", "Étage 1", "Étage 2", "Étage 3", "Étage 4", "Étage 5", ] as const;

namespace BedRoom {
    export type Id = string;

    export type StageId = typeof stages[number];

    export type Map = {[k in Id]: BedRoom.Type};

    export namespace Category {
        export type Id = string;

        export type Type = {
            id: Id,
            name: string,
            price: number,
            option: 'VENT' | 'CLIM',
        };
    }

    export type Type = RoomData & {
        connected: boolean,
        power: boolean | null,

        customer: TypeWithTrace<CustomerType> | null,
        booked: TypeWithTrace<ReservationType> | null,
        cleaner: TypeWithTrace<CleanType> | null,
        restauration: TypeWithTrace<RestaurantType>[],
    }

    export type IssueType = {
        date: Date,
        priority: PriorityId,
        message: string,
    }

    export function create(room: RoomData): BedRoom.Type {
        return ({ ...room,
            connected: false,
            power: null,

            customer: null,
            booked: null,
            cleaner: null,
            restauration: [],
        });
    }
    
}

export default BedRoom;
