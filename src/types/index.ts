import BedRoom from "./bedroom";
import Employer from "./employer";

export type State<T> = React.Dispatch<React.SetStateAction<T>>;

export type TypeWithId<T> = T & { id: string };

export type ReservationRoomStatus = "canceled" | "coming" | "passed" | "doing";




export type TypeWithTrace<T> = T & {
    id: number,
    roomId: BedRoom.Id,
    description?: string,
    auth_session: Employer.Id,
    date: Date,
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

export const colors: {[k in (StatusId | NotificationId)]: string} = {
    powered: '#cf0037',
    guest: '#074507',
    sold: '#05324d',
    coming: '#aa00c4',
    restaurant: '#00635b',
    cleaning: '#006a9c',
    issue: '#6a7585',
    free: '#407236',

    "DISCONNECTED": '#110c0d',
    "POWER_ON": '#cf0037',
    "POWER_OFF": '#cf0037',

    "CHECK_IN": '#074507',
    "CHECK_UPDATE": '#074507',
    "CHECK_MOVE": '#074507',
    "CHECK_OUT": '#074507',

    "CLEANING_START": '#006a9c',
    "CLEANING_CANCELED": '#006a9c',
    "CLEANING_DONE": '#006a9c',

    "BOOKED": '#aa00c4',
    "BOOKED_CANCELED": '#aa00c4',
} as const;














export type RestaurantType = {
    time: Date,
    roomId: BedRoom.Id,
    client: string,
    article: string,
    price: number,
    paid: boolean,
}

export type RoomType = {
    roomId: BedRoom.Id,
    power?: boolean,
    issue: BedRoom.IssueType | null,
}

export type NotificationType = {
} & ({
    label: 'DISCONNECTED' | 'POWER_ON' | 'POWER_OFF',
} | {
    label: 'CHECK_IN' | 'CHECK_UPDATE' | 'CHECK_OUT',
    datas: { clientName: string, }
} | {
    label: 'CHECK_MOVE',
    datas: { clientName: string, toRoomId: BedRoom.Id }
} | {
    label: 'CLEANING_START' | 'CLEANING_CANCELED' | 'CLEANING_DONE',
    datas: { cleanerName: string, }
} | {
    label: 'BOOKED' | 'BOOKED_CANCELED',
    // datas: { bookerName: string, bookedDate: Date, }
    datas: { bookerName: string, bookedDate: Date, },
})
export type NotificationId = (
    'DISCONNECTED' |
    'POWER_ON' |
    'POWER_OFF' |
        'CHECK_IN' |
        'CHECK_UPDATE' |
        'CHECK_MOVE' |
        'CHECK_OUT' |
    'CLEANING_START' |
    'CLEANING_CANCELED' |
    'CLEANING_DONE' |
        'BOOKED' |
        'BOOKED_CANCELED'
);


export type CleanType = {
    valletId: Employer.Id,
    description?: string,
} & ({
    done?: Date | null,
} | {
    cancel: Date,
})


export type CheckInType = {
    sexe?: 'Mr' | 'Mme',
    clientName: string,
    price: number,
    description?: string,
    start: Date,
} & ({
    status: 'CHECK_IN' | 'UPDATE' | 'MOVE_IN',
    end: Date | null,
} | {
    status: 'CHECK_OUT' | 'MOVE_OUT',
    end: Date,
})

export type ReservationType = {
    clientName: string,
    start: Date,
    end: Date | null,
    description?: string,
    cancel?: {
        date: Date,
        auth_session?: Employer.Id,
    },
}
