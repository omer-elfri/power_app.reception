'use client';

import { twMerge } from "tailwind-merge";
import { useDataContext } from "../../../hooks";
import { getFrenchDateTime } from "../../../tools/date";
import { formatPrice, getString } from "../../../tools";

import { Title } from "../../../components/SectionBox";
import { FaCheck } from "react-icons/fa";
import MyButton from "../../../components/MyButton";
import { ImCross } from "react-icons/im";
import { PopupBody } from "../..";

export default function RoomRestoPopup({ id:customerId, className }: {
  id?: number,
  className?: string,
}) {
  const { restaurant_book, } = useDataContext();
  const customer = restaurant_book.list.find(resto => resto.customer_id === customerId)?.customer;
  if (!customer) return;
  const gridStyle1 = "grid grid-cols-[50px_40px_1fr_1fr_50px_30px] items-center font-bold px-3 py-2 rounded";

  const MyTitle = () => {
    return (
      <Title bar right={customer.name}>
        <span className="">CH </span>
        <span className="text-[18px]">{customer.room_id}</span>
      </Title>
    );
  }

  return (
    <PopupBody top={<MyTitle />}
      className={twMerge("w-[400px]", className)}
      subClassName="flex flex-col gap-2">

      <div className={twMerge("text-[11px] bg-white", gridStyle1)}>
        <h1>Date</h1>
        <h1>CH</h1>
        <h1>Client</h1>
        <h1>Article</h1>
        <h1>Prix</h1>
      </div>

      { restaurant_book.list.map(resto => (
        <div className={twMerge("text-[10px] text-gray-600 bg-white/70", gridStyle1)}>
          <span>{getFrenchDateTime(resto.created_date)}</span>
          <span>{resto.customer.room_id}</span>
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

    </PopupBody>
  );
}

