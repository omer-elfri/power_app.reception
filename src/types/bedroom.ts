import { room_ctg_datas } from "../configs/room_ctg";
import { room_datas } from "../configs/room";
import Employer from "./employer";
import { IssueType, Power, StageId } from ".";

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
        price: number,
        categories: [
            Category.Id,
            ...Category.Id[],
        ],

        connected: boolean,
        power: Power,

        check_in: CheckInType | null,
        cleaning: CleaningType | null,
        coming: ReservationType | null,
        issues: IssueType[],
    }
    export type Map = {[k in Id]: Type};

    export type CheckInType = {
        name: string,
        sexe?: 'Mr' | 'Mme',
        price: number,
        start: Date,
        end: Date | null,

        mail?: string,
        enterprise?: string,
        ifu?: string,
        option?: string,
        nuitee?: string,
        sc?: string,
    };

    export type ReservationType = {
        client: string,
        id: BedRoom.Id,
        name?: string,
        start: Date,
        nuitee: number,
    }

    export type CleaningType = {
        vallet: Employer.Id,
        name: string,
        start: Date,
        end: Date | null,
    }
}

export default BedRoom;
