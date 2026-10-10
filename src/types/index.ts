import BedRoom from "./bedroom";
import Employer from "./employer";

export type State<T> = React.Dispatch<React.SetStateAction<T>>;

export type TypeWithId<T> = T & { id: string };

export type ReservationRoomStatus = "canceled" | "coming" | "passed" | "doing";




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
    sold: '#074507',
    coming: '#aa00c4',
    restaurant: '#c40000',
    cleaning: '#006a9c',
    issue: '#8997aa',
    free: '#4d8642',

    "DISCONNECTED": '#cf0037',
    "POWER_ON": '#cf0037',
    "POWER_OFF": '#074507',
    "CHECK_IN": '#074507',
    "CHECK_UPDATE": '#074507',
    "CHECK_MOVE": '#074507',
    "CHECK_OUT": '#aa00c4',
    "CLEANING_START": '#c40000',
    "CLEANING_CANCELED": '#006a9c',
    "CLEANING_DONE": '#8997aa',
    "BOOKED": '#aa00c4',
    "BOOKED_CANCELED": '#4d8642',
} as const;













// type HistoryContextType = {
//     notifications: NotificationType[],
//     addNotification: (props: NotificationProps) => void,
// };






export type TypeWithTrace<T> = T & {
    id: number,
    roomId: BedRoom.Id,
    description?: string,
    auth_session: Employer.Id,
    date: Date,
}




// TypeWithTrace




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
    // label: NotificationId,
    // // value: string,
    // datas?: Object;
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
    datas: { bookerName: string, bookedDate: Date, }
})
export type NotificationId =
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



    export type CleanType = {
        valletName: string,
        description?: string,
    } & ({
        end?: Date | null,
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






type ReservationProps = Omit<ReservationType, 'date' | 'auth_session'>;

export type ReservationType = {
    roomId: BedRoom.Id,
    clientName: string,
    start: Date,
    end: Date | null,
    description?: string,
    cancel?: {
        date: Date,
        auth_session?: Employer.Id,
    },
}

export type ReservationContextType = {
    bookedToday: Partial<{[k in BedRoom.Id]: ReservationType}>,
    reservationBook: ReservationType[],
    setReservations: State<ReservationType[]>,
    isBooked: (roomId: BedRoom.Id) => ReservationType | null,
    getStates: (
        status: ReservationRoomStatus[],
        rooms?: ReservationType[],
    ) => ReservationType[],
    getBookedPeriod: (start?: Date, end?: Date) => ReservationType[],
    getBookedStatus: (room: ReservationType) => ReservationRoomStatus,
    book: (props: ReservationProps[]) => void,
    cancel: (id: number) => void,
}
