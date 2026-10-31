import { Id, Sex } from '.';
import { TypeWithTrace } from '../hooks/bd/useBook';
import BedRoom from './bedroom';
import Employer from './employer';

export type CleanProps = {
    valet_id: Employer.Id,
    done?: Date,
}
export type CleanType = CleanProps & {
    valet: Employer.Type,
}


export type CustomerType = {
    sexe?: Sex,
    name: string,
    tel?: number,
    town?: string,
    price: number,
    reason?: string,
    end?: Date,
    enterprise?: string,
    ifu?: number,
    actions: CheckInType[];
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
}





export type RestaurantProps = {
    customer_id: Id,
    article: string,
    price: number,
    paid: boolean,
}
export type RestaurantType = RestaurantProps & {
    customer: TypeWithTrace<CustomerType>,
}

