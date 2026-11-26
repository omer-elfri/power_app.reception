'use client'

import { twMerge } from "tailwind-merge";
import { useDataContext } from "../../../hooks";
import { formatPrice } from "../../../tools";
import BedRoom from "../../../types/bedroom";
import { colors } from "../../../types";

import { AsideDiv } from "../../../components/AsideDiv";
import NoElem from "../../../components/NoElem";
import Caster from "../../../components/Caster";
import { RiRestaurantFill, RiServiceBellLine } from "react-icons/ri";
import RestoLine from "./RestoLine";

export default function RestaurantTab({ room:bedRoom, className }: {
    room: BedRoom.Type,
    className?: string,
}) {
    const { restaurant_book } = useDataContext();
    const customerRestos = restaurant_book.list.filter(resto =>
        resto.customer_id === bedRoom.customer?.id);
    const totalPrice = customerRestos.reduce((res, resto) => res + resto.price, 0);
    const gridStyle = "grid grid-cols-[40px_40px_1fr_60px_16px] gap-x-1 items-center";

    const right = (<>
        <p className='text-[12px]'>
            <span className=''>{formatPrice(totalPrice) || 0}</span>{' '}
            <span className='text-[9px]'>FCFA</span>
        </p>
        <Caster color={colors.restaurant} value={['RESTAURANT']} />
    </>);

    return (
        <AsideDiv no_bar={customerRestos.length > 0} title="Restauration" right={right}
            icon={<RiRestaurantFill size={15} className="text-green-800" />}
            className={twMerge("", className)} >
            <NoElem Icon={RiServiceBellLine} size={50} text="Aucune commande"
                className="gap-2" list={customerRestos}>
                <div className="flex flex-col">

                    <div className={twMerge("py-1 text-center px-2 text-[11px] text-center text-gray-600 border-y-1 \
                        border-gray-400/50 last:border-0 text-gray-800", gridStyle)}>
                        <span>Date</span>
                        <span>CH</span>
                        <span>Article</span>
                        <span>Prix</span>
                    </div>

                    { customerRestos.map(resto => (
                        <RestoLine key={resto.id} resto={resto} className={gridStyle} />
                    )) }

                </div>
            </NoElem>
        </AsideDiv>
    );
}

