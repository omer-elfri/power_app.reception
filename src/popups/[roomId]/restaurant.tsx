'use client'

import { twMerge } from "tailwind-merge";
import { useDataContext } from "../../hooks";
import BedRoom from "../../types/bedroom";

import FormAside from "../../components/FormAside";
import { RiRestaurantFill, RiServiceBellLine } from "react-icons/ri";

import { formatPrice } from "../../tools";
import LabelValue from "../../components/LabelValue";

export default function Restaurant({ room:bedRoom, className }: {
    room: BedRoom.Type,
    className?: string,
}) {
    const { restaurant } = useDataContext();
    const roomRestos = restaurant.filter(resto => resto.roomId === bedRoom.id);
    const totalPrice = roomRestos.reduce((res, resto) => res + resto.price, 0);

    return (
        <FormAside title="Restauration"
            icon={<RiRestaurantFill size={15} />}
            subClassName="gap-0"
            className={twMerge("", className)}
            right={ totalPrice > 0 && (
                <p className='text-[12px]'>
                <span className=''>{formatPrice(totalPrice)}</span>{' '}
                <span className='text-[9px]'>FCFA</span>
                </p> )
            }>{ roomRestos.length === 0 ?

                <div className='flex flex-col justify-center items-center gap-2 flex-1 text-center uppercase text-gray-400'>
                    <RiServiceBellLine size={30} />
                    <span className='text-[10px] mb-3'>Aucune commande</span>
                </div> :

                roomRestos.map((resto, i) => (
                    <div key={resto.id} className={twMerge("grid grid-cols-[auto_1fr_auto] w-full text-[11px] [&>*]:px-2 [&>*]:py-1", i%2===0 ? "bg-gray-300/40" : "")}>
                        <p>{resto.article}</p>
                        <p>{resto.client}</p>
                        <p>{formatPrice(resto.price)}</p>
                    </div>
                    // <LabelValue key={resto.id} label={resto.article}>{formatPrice(resto.price)}</LabelValue>
                ))
            }
        </FormAside>
    );
}

