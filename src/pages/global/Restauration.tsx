'use client'

import { twMerge } from "tailwind-merge";
import { useDataContext } from "../../hooks";

import { formatPrice } from "../../tools";
import { getTime } from "../../tools/date";

import SectionBox, { Title } from "../../components/SectionBox";
import NoElem from "../../components/NoElem";
import { RiServiceBellLine } from "react-icons/ri";

export default function RestaurationSection({ className }: {
  className?: string,
}) {
  const { restaurant_book } = useDataContext();

  return (
    <SectionBox className={twMerge("", className)}
      top={<Title right={restaurant_book.list.length} icon={<RiServiceBellLine size={22} />}>Restauration</Title>}>

      <NoElem list={restaurant_book.list} Icon={RiServiceBellLine} text="Vide" bar={true}>

        <table className="w-full border-separate border-spacing-y-2 border-spacing-x-3">

          <thead>
            <tr className="text-[11px] font-bold">
              <th className="">Heure</th>
              <th className="">Chambre</th>
              <th className="">Client</th>
              <th className="">Article</th>
              <th className="">Prix</th>
              <th className="">Statut</th>
            </tr>
          </thead>

          <thead>
            <tr><td colSpan={6} className="">
              <hr className="text-gray-400/40" />
            </td></tr>

            { restaurant_book.list.map((data, i) => (
              <tr key={i} className={twMerge("text-center py-2 text-gray-600 text-[11px] font-bold",
                (i!==restaurant_book.list.length-1) ? "border-b-1 border-gray-400/50" : "") }>
                <td className="">{getTime(data.created_date)}</td>
                <td className="text-[12px]">{data.room_id}</td>
                <td className="">{data.customer.name}</td>
                <td className="">{data.article}</td>
                <td className="">{formatPrice(data.price)}</td>
                <td className="">{data.paid
                  ? <span className="text-gray-400">payé</span>
                  : <span className="text-gray-400">...</span> }
                </td>
              </tr>
            )) }
          </thead>

        </table>

      </NoElem>

    </SectionBox>
  );
}
