'use client';

import { twMerge } from "tailwind-merge";
import { useAnalysis } from "../../hooks/useAnalysis";
import { formatPrice, getString } from "../../tools";

import { AsideDiv } from "../../components/AsideDiv";
import SoldRoom from "../../components/SoldRoom";

export default function RoomIssues({ className }: {
  className?: string,
}) {
  const { analysis } = useAnalysis();
  const nbSold = analysis.categories.reduce(
    (res, elem) => res + elem.topSolded.length, 0);

  return (
    <AsideDiv title="Ventes" right={getString(nbSold)} className={twMerge("", className)}
      subClassName="flex flex-col gap-3">{ analysis.categories.map((room_ctg) => (
        <SoldRoom key={room_ctg.name}
          name={room_ctg.name}
          subName={formatPrice(room_ctg.price)}
          sold={room_ctg.topSolded.length}
          total={room_ctg.topTotal.length}
        /> )) }
    </AsideDiv>
  );
}

