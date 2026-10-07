import { room_ctg_datas } from "../configs/room_ctg";
import { room_datas } from "../configs/room";
import { StageId } from ".";
import Employer from "./employer";
import { ReservationRoom } from "../hooks/reservation";

namespace BedRoom {
    export type Id = keyof typeof room_datas;

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
        description: string,

        connected: boolean,
        power: boolean | null,

        client: CheckInType | null,
        coming: ReservationRoom | null,
        cleaning: CleanType | null,
        issue: IssueType | null,
    }

    export type Map = {[k in Id]: BedRoom.Type};

    export type ReservationType = {
        client: string,
        id: BedRoom.Id,
        name?: string,
        start: Date,
        nuitee: number,
    }

    export type IssueType = {
        priority: 'low' | 'medium' | 'high',
        message: string,
    }

    export type CheckInType = {
        date: Date,
        sexe: 'Mr' | 'Mme',
        name: string,
        description: string,
        price: number,
    };

    export type CleanType = {
        start: Date,
        vallet: Employer.Type,
        description: string,
        end: Date | null,
    };

    
}

export default BedRoom;
