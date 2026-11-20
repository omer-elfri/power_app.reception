import { CleanType, CustomerType, ReservationType, RestaurantType } from "./types";
import { PriorityId } from "./index";
import { TypeWithTrace } from "../hooks/useBook";
import { ConfigType } from "../hooks/useConfig";

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
        category: ConfigType<BedRoom.Category.Type>,
        clean: TypeWithTrace<CleanType> | null,
        lastClean: TypeWithTrace<CleanType> | null,
    }

    export type Type = RoomData2 & {
        connected: boolean,
        power: boolean | null,

        cleaning: TypeWithTrace<CleanType> | null,
        customer: TypeWithTrace<CustomerType> & {
            restaurant: TypeWithTrace<RestaurantType>[],
        } | null,
        booked: TypeWithTrace<ReservationType> | null,
    }

}

export default BedRoom;

