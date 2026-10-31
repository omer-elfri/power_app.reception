'use client'

import { twMerge } from "tailwind-merge";
import BedRoom from "../../types/bedroom";

import { AsideDiv } from "../../components/FormAside";
import { RiRestaurantFill, RiServiceBellLine } from "react-icons/ri";

import { formatPrice } from "../../tools";
import { MyTr } from "../../components/MyTable";
import NoElem from "../../components/NoElem";
import { useDataContext } from "../../hooks";

export default function Restaurant({ room:bedRoom, className }: {
    room: BedRoom.Type,
    className?: string,
}) {
    const { customer_book, restaurant_book } = useDataContext();
    const roomRestos = restaurant_book.list
        .filter(resto => resto.customer_id === bedRoom.customer?.id);
    const totalPrice = roomRestos.reduce((res, resto) => res + resto.price, 0);

    const right = (
        <p className='text-[12px]'>
            <span className=''>{formatPrice(totalPrice) || 0}</span>{' '}
            <span className='text-[9px]'>FCFA</span>
        </p>
    );

    return (
        <AsideDiv title="Restauration" right={right}
            icon={<RiRestaurantFill size={15} className="text-green-800" />}
            className={twMerge("", className)} >

            <NoElem Icon={RiServiceBellLine} size={50} text="Aucune commande" className="gap-2" list={roomRestos}>

                <div className="flex flex-col">
                    { roomRestos.map(resto => <MyTr key={resto.id} color="bg-blue-400/20"
                        className="grid-cols-[auto_1fr_auto_auto] px-2 text-[11px] text-gray-600">
                        <p>{resto.article}</p>
                        <p>{customer_book.getId(resto.customer_id)?.name}</p>
                        <p>{customer_book.getId(resto.customer_id)?.room_id}</p>
                        <p>{formatPrice(resto.price)}</p>
                    </MyTr>) }
                </div>

            </NoElem>
        </AsideDiv>
    );
}

