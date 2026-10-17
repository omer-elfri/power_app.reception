import { ListStatus } from "../popups/list";
import BedRoom from "./bedroom";
import Employer from "./employer";

export type State<T> = React.Dispatch<React.SetStateAction<T>>;

export type TypeWithId<T> = T & { id: string };

export type Id = number;

export type FormType = 'line' | 'grid';

export type Sex = 'Mr' | 'Mme';

export type StageId = '0'|'1'|'2'|'3'|'4'|'5';

export type PriorityId = 'low' | 'medium' | 'high';

export type StatusId = 'powered' | 'guest' | 'coming' | 'cleaning' | 'issue' | 'restaurant' | 'sold' | 'free';




export type TypeWithTrace<T> = T & {
    id: Id,
    roomId: BedRoom.Id,
    auth_session: Employer.Id,
    date: Date,
    description?: string,
}

export const stages: {[k in StageId]: {
    name: string,
}} = {
    '0': { name: "Rez de chaussée", },
    '1': { name: "Étage 1", },
    '2': { name: "Étage 2", },
    '3': { name: "Étage 3", },
    '4': { name: "Étage 4", },
    '5': { name: "Étage 5", },
};

export const colors: {[k in (StatusId)]: string} = {
    powered: '#cf0037',
    guest: '#074507',
    sold: '#407236',
    free: '#40723660',
    coming: '#aa00c4',
    restaurant: '#00635b',
    cleaning: '#006a9c',
    issue: '#6a7585',
} as const;














export type RestaurantType = {
    customerId: Id,
    time: Date,
    client: string,
    article: string,
    price: number,
    paid: boolean,
}

export type RoomType = {
    power?: boolean,
    issue: BedRoom.IssueType | null,
}

export type CleanType = {
    sexe: Sex,
    valletId: Employer.Id,
    name: string,
} & ({
    done?: never,
    cancel?: never,
} | {
    done: Date,
    cancel?: never,
} | {
    done?: never,
    cancel: Date,
})


export type CustomerType = {
    sexe?: Sex,
    name: string,
    tel?: number,
    town?: string,
    price: number,
    end?: Date,
    actions: CheckInType[];
}
export type CheckInType = {
    date: Date,
    roomId: BedRoom.Id,
} & ({
    status: 'CHECK_IN',
    datas: { customer: Omit<CustomerType, 'actions'> },
} | {
    status: 'CHECK_UPDATE',
    datas: Partial<CustomerType>,
} | {
    status: 'CHECK_MOVE',
    datas: { fromRoomId: BedRoom.Id },
} | {
    status: 'CHECK_OUT',
    datas?: never,
})

export type ReservationType = {
    name: string,
    start: Date,
    end: Date,
    cancel?: {
        date: Date,
        auth_session?: Employer.Id,
    },
}

export type PopupType =
    [ 'CLEAN', BedRoom.Id? ] |
    [ 'BOOKING', number? ] |
    [ 'ROOM', BedRoom.Id ] |
    [ 'LIST', ListStatus? ] |
    [ 'VALLET', BedRoom.Id ] ;


