import { twMerge } from "tailwind-merge";
import { TypeWithTrace } from "../../hooks/useBook";

import { RestaurantType } from "../../types/types";
import { getFrenchDateTime } from "../../tools/date";
import { formatPrice } from "../../tools";

import { AsideDiv } from "../../components/AsideDiv";
import MyButton from "../../components/MyButton";
import { useDataContext } from "../../hooks";

export default function RestoGroup({ restos, className, subClassName, onClick }: {
  restos: TypeWithTrace<RestaurantType>[];
  className?: string,
  subClassName?: string,
  onClick?: () => void,
}) {
  const { restaurant_book } = useDataContext();
  const customer = restos[0].customer;
  const paidPrice = restaurant_book.list.filter(resto => resto.paid)
    .reduce((res, resto) => res + resto.price, 0);
  const unpaidPrice = restaurant_book.list.filter(resto => !resto.paid)
    .reduce((res, resto) => res + resto.price, 0);
  const totalPrice = paidPrice + unpaidPrice;

  return (
    <div className={twMerge("flex flex-col gap-2", className)} onClick={onClick}>

      <div className="flex flex-row gap-2 items-center px-3">
        <span className="font-bold uppercase text-[12px]">{customer?.name || "..."}</span>
        <div className="px-1 py-[1px] border-1 rounded text-[11px] font-bold text-green-800 border-green-800 bg-green-800/20">
          {customer?.room_id || "..."}
        </div>
      </div>

      { restos.map(resto => (
        <RestoLine key={resto.id} resto={resto} subClassName={twMerge("", subClassName)} />
      )) }

      <AsideDiv className="self-end" subClassName="flex-row">
        <span className="text-[13px] text-gray-600">{formatPrice(paidPrice)}</span>{" / "}
        <span className="">{formatPrice(totalPrice)}</span>
      </AsideDiv>

    </div>
  );
}

function RestoLine({ resto, className, subClassName }: {
  resto: TypeWithTrace<RestaurantType>,
  className?: string,
  subClassName?: string,
}) {
  return (
    <AsideDiv className={twMerge("text-[12px] text-gray-600 text-center bg-white/60 py-0", className)}
      subClassName={twMerge("", subClassName)}>
      <span>{getFrenchDateTime(resto.created_date)}</span>
      <span>{resto.room_id}</span>
      <span className="uppercase">{resto.customer?.name || "..."}</span>
      <span>{resto.article}</span>
      <span className="text-[14px] text-gray-700">{formatPrice(resto.price)}</span>
      <div className="uppercase">
        { resto.paid
          ? <span className="text-[11px]">payé</span>
          : <MyButton className="bg-green-400/20 border-1 border-green-600 uppercase !text-[10px] !px-2 !py-1" onClick={() => {}}>payer</MyButton>
        }
      </div>
    </AsideDiv>
  );
}

