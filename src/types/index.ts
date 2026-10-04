import BedRoom from "./bedroom";

export type State<T> = React.Dispatch<React.SetStateAction<T>>;

export type TypeWithId<T> = T & { id: string };

export function toTab<T extends Record<string, object>>(d: T)
    : TypeWithId<T[keyof T]>[]
{
    return Object.entries(d).map(([id, data]) => (
        { id, ...data, }  as TypeWithId<T[keyof T]>
    ));
}




export type FormType = 'line' | 'grid';

export type Sex = 'Mr' | 'Mme';

export type StageId = '0'|'1'|'2'|'3'|'4'|'5';

export type StatusId = 'powered' | 'guest' | 'coming' | 'cleaning' | 'issue' | 'restaurant' | 'sold' | 'free';

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

export const colors: {[k in StatusId]: string} = {
    powered: '#cf0037',
    guest: '#074507',
    sold: '#074507',
    coming: '#aa00c4',
    restaurant: '#c40000',
    cleaning: '#006a9c',
    issue: '#8997aa',
    free: '#4d8642',
} as const;


export type NotificationType = {
    time: Date,
    roomId: BedRoom.Id,
    label: StatusId,
    value: string,
}

export type RestaurantType = {
    time: Date,
    roomId: BedRoom.Id,
    client: string,
    article: string,
    price: number,
}

export type MoveType = {
    roomId: BedRoom.Id,
    sens: 'arrivée' | 'départ',
    client: string,
    come_at: Date,
    go_at: Date,
}
