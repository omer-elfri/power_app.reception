'use client';

import { twMerge } from "tailwind-merge";
import { useDataContext } from "../../hooks";
import { useRequest } from "../../hooks/useRequest";
import { formatPrice } from "../../tools";

import NoElem from "../../components/NoElem";
import { AsideDiv } from "../../components/AsideDiv";
import { MdCreditScore, MdRoomService } from "react-icons/md";
import { IoFastFoodOutline } from "react-icons/io5";
import { TbCreditCardOff } from "react-icons/tb";
import { CiCreditCard1 } from "react-icons/ci";
import { IconType } from "react-icons/lib";
import ItemPopup from "../items";
import RestoLine from "./RestoLine";

export default function RestaurantTab({ className }: {
  className?: string,
}) {
  const { restaurant_book, } = useDataContext();
  const { analysis } = useRequest();
  const restosCustomer = Object.entries( Object.groupBy(restaurant_book.list, resto => resto.customer.id) );
  const gridStyle1 = "grid grid-cols-[1fr_1fr_1fr_1fr_auto] gap-2 items-center font-bold px-3 py-2 rounded";

  return (
    <ItemPopup onglet="RESTAURANT" className={twMerge("", className)}
      subClassName="grid grid-rows-[1fr_auto] gap-5">

      <div className="flex flex-col gap-3 flex-1 overflow-auto">
        <NoElem list={restaurant_book.list} Icon={MdRoomService}
          size={50} text="Aucune commande" className="gap-2">

          <AsideDiv className="py-1" subClassName={twMerge("text-[11px]", gridStyle1)}>
            <span>Date</span>
            <span>CH</span>
            <span>Article</span>
            <span>Prix</span>
            <span>Action</span>
          </AsideDiv>

          <div className="flex flex-col gap-2 h-full">
            { restosCustomer.map(([customerId, restos]) => ( restos &&
              <RestoLine key={customerId} restos={restos} subClassName={gridStyle1} />
            ) )}
          </div>

        </NoElem>
      </div>

      <div className="flex flex-row [&>*]:flex-1 gap-3">
        <BottomBox title="Restaurations" Icon={IoFastFoodOutline} value={analysis.restaurant.total.reduce((res,resto) => res + resto.price, 0)} />
        <BottomBox title="Payés" Icon={MdCreditScore} value={analysis.restaurant.paid.reduce((res,resto) => res + resto.price, 0)} className="text-green-700" />
        <BottomBox title="Impayés" Icon={TbCreditCardOff} value={analysis.restaurant.unPaid.reduce((res,resto) => res + resto.price, 0)} className="text-red-700" />
        <BottomBox title="Crédits" Icon={CiCreditCard1} value={analysis.restaurant.unPaid.filter(resto => resto.customer.end).reduce((res,resto) => res + resto.price, 0)} />
      </div>

    </ItemPopup>
  );
}


function BottomBox({ title, Icon, className, value }: {
  title: string,
  Icon: IconType,
  className?: string,
  value: number,
}) {
  return (
    <div className={twMerge("grid grid-cols-[auto_1fr] gap-x-2 gap-y-0 p-2 rounded shadow-md bg-white", className)}>

      <div className="row-span-2 mt-2">
        <Icon size={25} className="text-gray-600" />
      </div>

      <h1 className={twMerge("font-bold text-[18px]",
        value > 0 ? "" : "text-gray-600")}>{formatPrice(value) || 0}
      </h1>

      <p className="font-bold text-[10px] text-gray-600 uppercase">{title}</p>

    </div>
  );
}

