'use client';

import { twMerge } from "tailwind-merge";
import { useDataContext } from "../../hooks";
import { getFrenchDateTime } from "../../tools/date";
import { formatPrice, getString } from "../../tools";

import ItemPopup from "../items";
import { AsideDiv } from "../../components/FormAside";
import NoElem from "../../components/NoElem";
import { MdRoomService } from "react-icons/md";
import Employer from "../../types/employer";
import { RestaurantType } from "../../types/types";
import { TypeWithTrace } from "../../hooks/useBook";
import LabelValue from "../../components/LabelValue";
import { Title } from "../../components/SectionBox";
import { FaCheck } from "react-icons/fa";
import MyButton from "../../components/MyButton";
import { ImCross } from "react-icons/im";
import { useVisual } from "../../hooks/useVisual";
import Room from "../../components/Room";

export default function RestaurantTab({ id, className }: {
  id?: number,
  className?: string,
}) {
  const { addPopup } = useVisual();
  const { restaurant_book, } = useDataContext();
  const restosCustomer = Object.entries( Object.groupBy(
    restaurant_book.list, resto => resto.customer.id) );
  // const checkIns = restaurant_book.list.filter(resto => !resto.customer.end);
  // const checkOuts = restaurant_book.list.filter(resto => resto.customer.end);
  const gridStyle1 = "grid grid-cols-[50px_40px_1fr_2fr_60px_30px] gap-2 items-center font-bold px-3 py-2 rounded";

  // const FR = ({ title, value }: {
  //   title: string,
  //   value: number,
  // }) => {
  //   return (
  //     <div className="p-2 rounded grid gap-1 shadow-md bg-white">
  //       <h1 className={twMerge("font-bold text-[18px]",
  //         value > 0 ? "" : "text-gray-600")}>{getString(value)}
  //       </h1>
  //       <p className="font-bold text-[10px] text-gray-600 uppercase">{title}</p>
  //     </div>
  //   );
  // }

  return (
    <ItemPopup onglet="RESTAURANT" className={twMerge("", className)} subClassName="flex flex-col gap-5">

      <NoElem list={restaurant_book.list} Icon={MdRoomService}
        size={50} text="Aucune commande" className="gap-2">

        {/* <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,220px))] items-start gap-2 h-full">
          { restosCustomer.map(([customerId, restos]) => ( restos &&
            <RestoBox key={customerId} restos={restos} className="cursor-pointer"
              onClick={() => addPopup(['ROOM_RESTO', parseInt(customerId)])}
            />
          ) )}
        </div> */}


        <div className="flex flex-col gap-2">
    
          <div className={twMerge("text-[11px] bg-white uppercase", gridStyle1)}>
            <h1>Date</h1>
            <h1>CH</h1>
            <h1>Client</h1>
            <h1>Article</h1>
            <h1>Prix</h1>
          </div>
    
          { restaurant_book.list.map(resto => (
            <div className={twMerge("text-[12px] text-gray-600 bg-white/60", gridStyle1)}>
              <span>{getFrenchDateTime(resto.created_date)}</span>
              <Room id={resto.customer.room_id} />
              <span>{resto.customer.name}</span>
              <span>{resto.article}</span>
              <span className="text-[12px]">{formatPrice(resto.price)}</span>
              <div className="">
                { resto.paid
                  ? <MyButton icon={<FaCheck size={8} />} onClick={() => {}} />
                  : <MyButton icon={<ImCross size={8} className="text-red-800" />} className="bg-red-400/20" onClick={() => {}} />
                }
                {/* <FaCheck className={twMerge("", true ? "text-gray-400/80" : "text-green-700 cursor-pointer")} /> */}
              </div>
            </div>
          )) }
    
        </div>

      </NoElem>

      {/* <div className="col-span-full flex flex-row [&>*]:flex-1 gap-3">
        <FR title="Restaurations" value={0} />
        <FR title="Payés" value={0} />
        <FR title="Impayés" value={0} />
        <FR title="Crédits" value={0} />
      </div> */}

    </ItemPopup>
  );
}

// function RestoBox({ restos, className, onClick }: {
//   restos: TypeWithTrace<RestaurantType>[];
//   className?: string,
//   onClick?: () => void,
// }) {
//   const customer = restos[0].customer;
//   const paidPrice = restos.filter(resto => resto.paid)
//     .reduce((res, resto) => res + resto.price, 0);
//   const unpaidPrice = restos.filter(resto => !resto.paid)
//     .reduce((res, resto) => res + resto.price, 0);
//   const totalPrice = paidPrice + unpaidPrice;

//   return (
//     <AsideDiv title={customer.room_id+" - "+customer.name} onClick={onClick}
//       className={twMerge("flex flex-col gap-2 min-h-45", !customer.end ? "" : "bg-red-400", className )}
//       right={paidPrice === totalPrice && <div className="flex justify-center items-center p-1 size-5 rounded-full bg-green-700">
//         <FaCheck className="text-white" />
//       </div>}
//       bottom={
//         <div className="flex flex-col gap-1 px-2 py-1 rounded bg-gray-400/20 text-gray-600 text-[11px]">
//           <LabelValue label="Payé" className="text-green-800">{formatPrice(paidPrice) || 0}</LabelValue>
//           <LabelValue label="Impayé" className="text-red-800">{formatPrice(unpaidPrice) || 0}</LabelValue>
//           <LabelValue label="Total" className="items-end [&>span]:text-[14px] text-black">{formatPrice(totalPrice)}</LabelValue>
//         </div>
//       }>

//       { restos.map(resto => (
//         <div key={resto.id} className="grid grid-cols-[40px_1fr_40px] gap-1 text-[11px]">
//           <p className="">{getFrenchDateTime(resto.created_date)}</p>
//           <p className="">{resto.article}</p>
//           <p className={twMerge('text-right', resto.paid ? "line-through decoration-red-500 decoration-1" : "")}>{formatPrice(resto.price)}</p>
//         </div>
//       )) }
//     </AsideDiv>
//   );
// }

