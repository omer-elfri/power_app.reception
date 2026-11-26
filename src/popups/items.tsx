'use client';

import React from "react";
import { twMerge } from "tailwind-merge";
import { getString } from "../tools";

import { useDataContext } from "../hooks";
import { useVisual } from "../hooks/useVisual";
import { useAnalysis } from "../hooks/useAnalysis";

import { CloseBtn, PopupBody } from ".";
import { Title } from "../components/SectionBox";
import OngletDiv, { OngletType } from "../components/OngletTab";

export const itemIds = ['BEDROOM', 'CLEANING', 'RESERVATION', 'RESTAURANT'] as const;
export type ItemId = typeof itemIds[number];

export default function ItemPopup({ onglet, className, subClassName, children }: {
  onglet: ItemId,
  className?: string,
  subClassName?: string,
  children: (searchtext: string) => React.ReactNode,
}) {
  const { reservation_book, restaurant_book } = useDataContext();
  const { switchPopup } = useVisual();
  const { analysis } = useAnalysis();
  const [searchText, setSearchText] = React.useState("");

  const datas: [OngletType<ItemId>, ...OngletType<ItemId>[]] = [{
    key: 'BEDROOM',
    value: "Chambres",
    rightIcon: getString(analysis.solded.length),
    tabStyle: "bg-blue-800/20 text-blue-800",
  },{
    key: 'CLEANING',
    value: "Néttoyage",
    rightIcon: getString(analysis.cleaning.total.length),
    tabStyle: "bg-blue-400/20 text-blue-900",
  },{
    key: 'RESERVATION',
    value: "Réservations",
    rightIcon: getString(reservation_book.list.length),
    tabStyle: "bg-purple-400/20 text-purple-900",
  },{
    key: 'RESTAURANT',
    value: "Restauration",
    rightIcon: getString(restaurant_book.list.length),
    tabStyle: "bg-yellow-400/20 text-yellow-900",
  }];

  return (
    <PopupBody
      top={<Title bar className="gap-2" right={<>
        {searchText}
        <input autoFocus placeholder="Rechercher"
          value={searchText}
          onChange={e => setSearchText(e.target.value)}
          className="w-45 px-2 py-[3px] !border-gray-600/50 bg-white/60" />
        <CloseBtn />
      </>}>Tableau de bord</Title>}
      className={twMerge(className, "h-160")}>

      <OngletDiv datas={datas}
        subClassName={subClassName}
        onglet={datas.find(o => o.key === onglet)}
        setOnglet={elem => switchPopup([elem.key])}>
        { () => children(searchText) }
      </OngletDiv>

    </PopupBody>
  );
}

