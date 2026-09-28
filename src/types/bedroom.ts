import { room_ctg_datas } from "../configs/room_ctg";
import { room_datas } from "../configs/room";
import { room_list } from "../datas/types";

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


    export namespace Status {

        export type Label = 'guest' | 'coming' | 'clean' | 'hs' | 'restaurant' | 'sold' | 'free';

        export const colors: {[k in Label]: string} = {
            guest: '#074507',
            sold: '#074507',
            coming: '#aa00c4',
            restaurant: '#c40000',
            clean: '#006a9c',
            hs: '#8997aa',
            free: '#4d8642',
        } as const;
    }
    



    export namespace Stage {

        export type Id = '0' | '1' | '2' | '3' | '4' | '5';

        export const stages: {[k in Id]: Type} = {
            '0': { name: "Rez de chaussée", },
            '1': { name: "Étage 1", },
            '2': { name: "Étage 2", },
            '3': { name: "Étage 3", },
            '4': { name: "Étage 4", },
            '5': { name: "Étage 5", },
        };

        export type Type = {
            // id: string,
            name: string,
        };
    }






    export type Type = {
        id: Id,
        power: Power,
        connected: boolean,

        check_in: Object | null,
        check_out: Object | null,
        coming: Object[
        ],
        cleaning: Object | null,
        // {
        //     name: string,
        //     start: Date,
        //     end?: Date,
        // } | null,
        stage: Stage.Type,
        categories: [
            Category.Type,
            ...Category.Type[],
        ],
        histories: History[],
        price: number,
        hs: boolean,
    };






    export function is(roomId: string): roomId is Id {
        return room_list.some(room => room.id === roomId);
    }

    export type Map = {[k in Id]: Type};

    export type Power = 'ON' | 'OFF' | null;

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
