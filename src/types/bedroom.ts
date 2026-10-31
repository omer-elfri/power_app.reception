import { CleanType, CustomerType, ReservationType, RestaurantType } from "./types";
import { PriorityId } from "./index";
import { TypeWithTrace } from "../hooks/bd/useBook";
import Employer from "./employer";

export const stages = [ "Rez de chaussée", "Étage 1", "Étage 2", "Étage 3", "Étage 4", "Étage 5", ] as const;

namespace BedRoom {
    export type Id = string;

    export type StageId = typeof stages[number];

    export type Map = {[k in Id]: BedRoom.Type};

    export namespace Category {
        export type Id = string;

        export type Type = {
            id: BedRoom.Category.Id,
            name: string,
            price: number,
            option: 'VENT' | 'CLIM',
        };
    }

    export type IssueType = {
        date: Date,
        priority: PriorityId,
        message: string,
    }

    export type RoomData = {
        id: BedRoom.Id,
        name: string,
        category_id: BedRoom.Category.Id,
        stage: BedRoom.StageId,
        issue: BedRoom.IssueType | null,
    }

    export type RoomData2 = RoomData & {
        category: BedRoom.Category.Type,
        lastClean: TypeWithTrace<CleanType> | null,
    }

    export type Type = RoomData2 & {
        connected: boolean,
        power: boolean | null,

        clean: TypeWithTrace<CleanType> & {
            valet: Employer.Type,
        } | null,
        customer: TypeWithTrace<CustomerType> & {
            restaurant: TypeWithTrace<RestaurantType>[],
        } | null,
        booked: TypeWithTrace<ReservationType> | null,
        reservations: TypeWithTrace<ReservationType>[],
        restaurations: TypeWithTrace<RestaurantType>[],
    }

}

export default BedRoom;

