import { twMerge } from "tailwind-merge";

import { formatPrice } from "../../tools";
import { getTime } from "../../tools/date";
import { TypeWithTrace } from "../../hooks/useBook";
import { RestaurantType } from "../../types/types";
import NoElem from "../../components/NoElem";
import { RiServiceBellLine } from "react-icons/ri";

export default function RestaurationSection({ restaurations }: {
  restaurations: TypeWithTrace<RestaurantType>[];
}) {
  return (
    <NoElem list={restaurations} Icon={RiServiceBellLine} text="Vide" bar={true}>

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

          { restaurations.map((data, i) => (
            <tr key={i} className={twMerge("text-center py-2 text-gray-600 text-[11px] font-bold",
              (i!==restaurations.length-1)?"border-b-1 border-gray-400/50":"")}>
              <td className="">{getTime(data.time)}</td>
              <td className="text-[12px]">{data.roomId}</td>
              <td className="">{data.client}</td>
              <td className="">{data.article}</td>
              <td className="">{formatPrice(data.price)}</td>
              <td className="">{data.paid
                ? <span className="text-gray-400">payé</span>
                : "" }
              </td>
            </tr>
          )) }
        </thead>

      </table>

    </NoElem>
  );
}
