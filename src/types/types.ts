import { Id, Sex } from '.';
import { TypeWithTrace } from '../hooks/useBook';
import BedRoom from './bedroom';
import Employer from './employer';

export type CleanType = {
    valet_id: Employer.Id,

    done?: Date,
    valet?: Employer.Type,
}


export type CustomerType = {
    name: string,
    price: number,
    actions: CheckInType[],

    sexe?: Sex,
    tel?: number,
    town?: string,
    reason?: string,
    end?: Date,
    enterprise?: string,
    ifu?: number,
}
export type CheckInType = {
    date: Date,
    room_id: BedRoom.Id,
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
    start_date: Date,
    end_date: Date,
    description: string,
}


export type RestaurantType = {
    customer_id: Id,
    article: string,
    price: number,
    paid: boolean,

    customer?: TypeWithTrace<CustomerType>,
}

