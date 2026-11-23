'use client'

import { twMerge } from "tailwind-merge";
import { useDataContext } from "../../hooks";
import { useRequest } from "../../hooks/useRequest";
import { formatPrice } from "../../tools";
import BedRoom from "../../types/bedroom";
import { colors } from "../../types";

import { AsideDiv } from "../../components/AsideDiv";
import NoElem from "../../components/NoElem";
import MyButton from "../../components/MyButton";
import Caster from "../../components/Caster";
import { RiRestaurantFill, RiServiceBellLine } from "react-icons/ri";
import { FaCheck } from "react-icons/fa";

export default function Restaurant({ room:bedRoom, className }: {
    room: BedRoom.Type,
    className?: string,
}) {
    const { pay_restaurant } = useRequest();
    const { customer_book, restaurant_book } = useDataContext();
    const customerRestos = restaurant_book.list
        .filter(resto => resto.customer_id === bedRoom.customer?.id);
    const totalPrice = customerRestos.reduce((res, resto) => res + resto.price, 0);
    const gridStyle = "grid grid-cols-[1fr_30px_1fr_40px_16px] gap-x-1 items-center";

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

            <NoElem Icon={RiServiceBellLine} size={50} text="Aucune commande" className="gap-2" list={customerRestos}>

                <div className="flex flex-col">

                    <div className={twMerge("py-1 text-center px-2 text-[11px] text-center text-gray-600 border-y-1 border-gray-400/50 last:border-0 text-gray-800", gridStyle)}>
                        <span>Article</span>
                        <span>CH</span>
                        <span>Client</span>
                        <span>Prix</span>
                    </div>

                    { customerRestos.map(resto =>
                        <div key={resto.id} color="bg-blue-400/20"
                            className={twMerge("px-2 py-2 text-[11px] text-gray-600 border-b-1 border-gray-400/50 last:border-0 text-center", gridStyle)}>
                            <p className="text-left">{resto.article}</p>
                            <p className="text-gray-800 text-[12px]">{customer_book.getId(resto.customer_id)?.room_id}</p>
                            <p className="">{customer_book.getId(resto.customer_id)?.name}</p>
                            <p className="text-black text-[12px]">{formatPrice(resto.price)}</p>
                            <div className="uppercase">{ !resto.paid ?
                                <span className="text-[11px]">payé</span> :
                                <MyButton icon={<FaCheck size={10} className="text-green-800" />}
                                    className="bg-green-400/20 border-1 border-green-600 uppercase !text-[10px] !px-1 !py-[2px]"
                                    onClick={() => pay_restaurant(resto.id)}
                                /> }
                            </div>
                        </div>
                    ) }
                </div>

            </NoElem>
        </AsideDiv>
    );
}

