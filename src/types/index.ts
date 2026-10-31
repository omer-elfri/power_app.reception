import { ListStatus } from "../popups/list";
import BedRoom from "./bedroom";

export type State<T> = React.Dispatch<React.SetStateAction<T>>;

export type TypeWithId<T> = T & { id: string };

export type Id = number;

export type Map<T, K extends PropertyKey=Id> = Record<K, T>;

export type Sex = 'Mr' | 'Mme';

export type PriorityId = 'low' | 'medium' | 'high';

export type StatusId = 'powered' | 'guest' | 'coming' | 'cleaning' | 'issue' | 'restaurant' | 'sold' | 'free';


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


const tables = [
    'bedroom_table', 'bedroom_ctg_table', 'employer_table',
    'cleaning_book', 'customer_book', 'reservation_book', 'restaurant_book',
] as const;

export type TableId = typeof tables[number];
