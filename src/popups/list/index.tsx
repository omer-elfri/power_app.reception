'use client';

import React from 'react';
import Popup, { CloseBtn, PopupBody } from "..";

import { useDataContext } from "../../hooks";
import { useBedroom } from "../../hooks/useBedroom";
import BedRoom from '../../types/bedroom';
import { getString } from '../../tools';

import { CleanTab, FreeTab, IssueTab, PowerTab, SoldTab } from './tabs';
import OngletTab from '../../components/OngletTab';
import { Title } from "../../components/SectionBox";
import NoElem from '../../components/NoElem';

import { IoBed } from "react-icons/io5";
import { PiBroomBold } from 'react-icons/pi';
import { BiBed } from 'react-icons/bi';


export type ListStatus = 'powered' | 'sold' | 'free' | 'clean' | 'issue';

export default function ListPopup({ status }: {
  status?: ListStatus,
}) {
  const [onglet, setOnglet] = React.useState<ListStatus>(status ?? 'powered');
  const { addPopup, isObsolet } = useDataContext();
  const { analysis, bedRoomTab } = useBedroom();

  const options: {[k in ListStatus] : { value: string, rooms: BedRoom.Type[] }} = {
    'powered': { value: "Alimentées", rooms: analysis.powered, },
    'sold': { value: "Vendues", rooms: analysis.solded, },
    'free': { value: "Disponibles", rooms: analysis.free },
    'clean': { value: "Néttoyage", rooms: bedRoomTab.filter(room => room.cleaner || isObsolet(room.id)) },
    'issue': { value: "En pannes", rooms: analysis.issues },
  }
  const datas = options[onglet].rooms;

  return (
    <Popup>
      <PopupBody className='h-130'
        top={<Title bar icon={<IoBed size={20} />} right={<CloseBtn />}>Filtre de chambres</Title>}
        bottom={
         <div className='flex flex-row justify-end'>
          <button className='border-1 bg-blue-500 text-white' onClick={() => addPopup(['CLEAN'])}>
            <PiBroomBold />
            <span className='ml-0'>Table de néttoyage</span>
          </button>
        </div>
      }>

        <OngletTab onglet={onglet} setOnglet={text => setOnglet(text as ListStatus)}
          datas={ Object.entries(options).map(([key, { value, rooms }]) => ({ key,
            value: <div className='flex flex-row justify-between w-full gap-2'>
              <p>{value}</p><p>{getString(rooms.length) || ''}</p></div>,
          }) ) } subClassName='px-5 py-1 bg-gray-300/40 rounded'>

          <NoElem text="Aucun élément" Icon={BiBed} className='text-[15px]' list={datas}>
            { onglet === 'powered' ? <PowerTab datas={datas} /> :
              onglet === 'sold' ? <SoldTab datas={datas} /> :
              onglet === 'free' ? <FreeTab datas={datas} /> :
              onglet === 'clean' ? <CleanTab datas={datas} /> :
              onglet === 'issue' ? <IssueTab datas={datas} /> :
              null }
          </NoElem>

        </OngletTab>

      </PopupBody>
    </Popup>
  );
}
