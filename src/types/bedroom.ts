import { room_ctg_datas } from "../configs/room_ctg";
import { room_datas } from "../configs/room";
import { StageId } from ".";
import { RoomState } from "../hooks/room";
import Employer from "./employer";

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
        power?: Power,

        client: CheckInType | null,
        cleaning: CleanType | null,
        issue: IssueType | null,
    }

    export type Map = {[k in Id]: RoomState};

    export type Power = boolean | null;

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
        sexe: 'Mr' | 'Mme',
        name: string,
        description: string,
    
        start: {
            date: Date,
            price: number,
            receptionnist: Employer.Type,
        },
        end: {
            date: Date,
            price: number,
            employer: Employer.Type,
        } | null,
    };

    export type CleanType = {
        vallet: Employer.Type,
        description: string,
        start: {
            date: Date,
            receptionnist: Employer.Type | 'admin',
        },
        end: {
            date: Date,
            employer: Employer.Type,
        } | null,
    };

    
}

export default BedRoom;
