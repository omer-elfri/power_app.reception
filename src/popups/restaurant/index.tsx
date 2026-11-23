'use client';

import { twMerge } from "tailwind-merge";
import { useDataContext } from "../../hooks";
import { useAnalysis } from "../../hooks/useAnalysis";

import NoElem from "../../components/NoElem";
import { AsideDiv } from "../../components/AsideDiv";

import { MdCreditScore, MdRoomService } from "react-icons/md";
import { IoFastFoodOutline } from "react-icons/io5";
import { TbCreditCardOff } from "react-icons/tb";
import { CiCreditCard1 } from "react-icons/ci";

import ItemPopup from "../items";
import RestoGroup from "./RestoGroup";
import BottomBox from "./RestoBottom";
import { normalizeSearch } from "../../tools";

const gridStyle1 = "grid grid-cols-[60px_40px_1fr_1fr_60px_auto] gap-2 items-center font-bold px-3 py-2 rounded";

export default function RestaurantTab({ className }: {
  className?: string,
}) {
  const { analysis } = useAnalysis();

  return (
    <ItemPopup onglet="RESTAURANT" className={twMerge("", className)}
      subClassName="grid grid-rows-[1fr_auto] gap-5">
      { searchText => <>

        <div className="flex flex-col gap-3 flex-1 overflow-auto">

          <AsideDiv className="py-1" subClassName={twMerge("text-[11px] text-center", gridStyle1)}>
            <span>Date</span>
            <span>CH</span>
            <span>Client</span>
            <span>Article</span>
            <span>Prix</span>
            <span>Action</span>
          </AsideDiv>

          <RestoList searchText={searchText} />

        </div>

        <div className="flex flex-row [&>*]:flex-1 gap-3">
          <BottomBox title="Restaurations" Icon={IoFastFoodOutline} value={analysis.restaurant.total.reduce((res,resto) => res + resto.price, 0)} />
          <BottomBox title="Payés" Icon={MdCreditScore} value={analysis.restaurant.paid.reduce((res,resto) => res + resto.price, 0)} className="text-green-700" />
          <BottomBox title="Impayés" Icon={TbCreditCardOff} value={analysis.restaurant.unPaid.reduce((res,resto) => res + resto.price, 0)} className="text-red-700" />
          <BottomBox title="Crédits" Icon={CiCreditCard1} value={analysis.restaurant.unPaid.filter(resto => resto.customer?.end).reduce((res,resto) => res + resto.price, 0)} />
        </div>

      </> }
    </ItemPopup>
  );
}

function RestoList({ searchText, className }: {
  searchText: string,
  className?: string,
}) {
  const { restaurant_book } = useDataContext();

  const restaurantList = restaurant_book.list
    .filter(resto => {
      const tab = [
        resto.room_id, resto.article,
        resto.customer?.name,
        resto.price.toString(),
      ].filter(elem => !!elem);
      return tab.some(elem => normalizeSearch(elem!)
        .includes( normalizeSearch(searchText) )
      );
    });

  const restosCustomer = Object.entries( Object.groupBy(
    restaurantList.filter(resto => resto.customer),
    resto => resto.customer!.id) );

  return (
    <NoElem list={restaurantList} Icon={MdRoomService}
      size={50} text="Aucune commande" className="gap-2">

      <div className={twMerge("flex flex-col gap-2 h-full", className)}>
        { restosCustomer.map(([customerId, restos]) => ( restos &&
          <RestoGroup key={customerId} restos={restos} subClassName={gridStyle1} />
        ) )}
      </div>

    </NoElem>
  );
}

