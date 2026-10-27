import { ListStatus } from "../popups/list";
import BedRoom from "./bedroom";
import Employer from "./employer";

export type State<T> = React.Dispatch<React.SetStateAction<T>>;

export type TypeWithId<T> = T & { id: string };

export type Id = number;

export type Map<T, K extends PropertyKey=Id> = Record<K, T>;

export type Sex = 'Mr' | 'Mme';

export type PriorityId = 'low' | 'medium' | 'high';

export type StatusId = 'powered' | 'guest' | 'coming' | 'cleaning' | 'issue' | 'restaurant' | 'sold' | 'free';

export type CancelType = {
    date: Date,
    auth_session?: Employer.Id,
}


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

export type PopupType =
    [ 'CLEAN', BedRoom.Id? ] |
    [ 'BOOKING', number? ] |
    [ 'ROOM', BedRoom.Id ] |
    [ 'CHECK_IN', BedRoom.Id ] |
    [ 'LIST', ListStatus? ] |
    [ 'USER' ] |
    [ 'CHANGE_PASS'] |
    [ 'VALLET', BedRoom.Id ] ;

