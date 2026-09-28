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
    
        export type Type = {
            label: string,
            color: string,
        };
    
        export type Id = 'sold' | 'free' | 'clean' | 'restaurant' | 'booked' | 'hs';
    
        export const datas: {[k in Id]: Type} = {
            sold: {
                label: 'Vendu',
                color: '#074507',
            },
            booked: {
                label: 'Réservée',
                color: '#aa00c4',
            },
            restaurant: {
                label: 'Restaurant',
                color: '#c40000',
            },
            clean: {
                label: 'Néttoyage',
                color: '#28bbff',
            },
            hs: {
                label: 'Hors service',
                color: '#8997aa',
            },
            free: {
                label: 'Disponible',
                color: '#8997aa30',
            },
        } as const;
    }
    



    export namespace Stage {

        export type StageData = {
            name: string,
        };

        export const stages = {
            '0': { name: "Rez de chaussée", },
            '1': { name: "Étage 1", },
            '2': { name: "Étage 2", },
            '3': { name: "Étage 3", },
            '4': { name: "Étage 4", },
            '5': { name: "Étage 5", },
        } as const satisfies Record<string, StageData>;

        export type Id = keyof typeof stages;

        export type Type = {
            id: string,
            name: string,
        };
    }






    export type Type = {
        id: Id,
        status?: Status,
        power: Power,
        // client?: Customer.Type,
        stage: Stage.Type,
        categories: [
            Category.Type,
            ...Category.Type[],
        ],
        history?: History[],
        price: number,
    };






    export function is(roomId: string): roomId is Id {
        return room_list.some(room => room.id === roomId);
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
