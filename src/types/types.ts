import { Id, Sex } from '.';
import BedRoom from './bedroom';
import Employer from './employer';

type CancelType = {
    date: Date,
    auth_session?: Employer.Id,
};

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
    cancel: CancelType,
})

export type CustomerType = {
    sexe?: Sex,
    name: string,
    tel?: number,
    town?: string,
    price: number,
    end?: Date,
    enterprise?: string,
    ifu?: number,
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
    cancel?: CancelType,
}

export type RestaurantType = {
    customerId: Id,
    time: Date,
    client: string,
    article: string,
    price: number,
    paid: boolean,
    cancel?: CancelType,
}

