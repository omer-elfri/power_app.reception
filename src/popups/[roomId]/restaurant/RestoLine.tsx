import { twMerge } from "tailwind-merge";

import { useDataContext } from "../../../hooks";
import { useRequest } from "../../../hooks/useRequest";
import { TypeWithTrace } from "../../../hooks/useBook";

import { RestaurantType } from "../../../types/types";
import { formatPrice } from "../../../tools";
import { getFrenchDateTime } from "../../../tools/date";

import MyButton from "../../../components/MyButton";
import { FaCheck } from "react-icons/fa";

export default function RestoLine({ resto, className }: {
    resto: TypeWithTrace<RestaurantType>,
    className?: string,
}) {
    const { pay_restaurant } = useRequest();
    const { customer_book } = useDataContext();

    return (
        <div color="bg-blue-400/20"
            className={twMerge("px-2 py-2 text-[11px] text-gray-600 border-b-1 border-gray-400/50 last:border-0 text-center", className)}>

            <p className="">{getFrenchDateTime(resto.created_date)}</p>

            <p className="text-gray-800 text-[12px]">{customer_book.getId(resto.customer_id)?.room_id}</p>

            <p className="">{resto.article}</p>

            <p className="text-black text-[12px]">{formatPrice(resto.price)}</p>

            <div className="uppercase">{ !resto.paid ?
                <span className="text-[11px]">payé</span> :
                <MyButton icon={<FaCheck size={10} className="text-green-800" />}
                    className="bg-green-400/20 border-1 border-green-600 uppercase !text-[10px] !px-1 !py-[2px]"
                    onClick={() => pay_restaurant(resto.id)}
                /> }
            </div>

        </div>
    );
}

