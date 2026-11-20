'use client';

import React from "react";
import { twMerge } from "tailwind-merge";
import { CloseBtn, PopupBody } from ".";

import { useDataContext } from "../hooks";
import { useRequest } from "../hooks/useRequest";

import { Title } from "../components/SectionBox";
import OngletDiv, { OngletType } from "../components/OngletTab";
import { getString } from "../tools";
import { useVisual } from "../hooks/useVisual";

export const itemIds = ['BEDROOM', 'CLEANING', 'RESERVATION', 'RESTAURANT'] as const;
export type ItemId = typeof itemIds[number];

export default function ItemPopup({ onglet, className, subClassName, children }: {
  onglet: ItemId,
  className?: string,
  subClassName?: string,
  children?: React.ReactNode,
}) {
  const { switchPopup } = useVisual();
  const { reservation_book, restaurant_book } = useDataContext();
  const { analysis } = useRequest();

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
    <PopupBody top={<Title bar className="gap-2" right={<>
      {/* <input type="search" className=" !border-0 !border-b-1 !border-gray-500 pb-1 !rounded-none" placeholder="Rechercher" /> */}
      <CloseBtn />
    </>}>Tableau de bord</Title>}
      className={twMerge(className, "h-160")}>

      <OngletDiv datas={datas} subClassName={subClassName}
        onglet={datas.find(o => o.key === onglet)}
        setOnglet={elem => switchPopup([elem.key])}>
        { () => children }
      </OngletDiv>

    </PopupBody>
  );
}

