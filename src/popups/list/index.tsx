'use client';

import React from 'react';
import { twMerge } from 'tailwind-merge';
import Popup, { PopupBody } from "..";

import { useDataContext } from "../../hooks";
import { useBedroom } from "../../hooks/useBedroom";
import BedRoom from '../../types/bedroom';

import OngletTab from '../../components/OngletTab';
import { Title } from "../../components/SectionBox";
import NoElem from '../../components/NoElem';

import { ImCross } from "react-icons/im";
import { IoBed } from "react-icons/io5";
import { getFrenchDateTime, getString } from '../../tools';
import { stages } from '../../types';

export type ListStatus = 'all' | 'sold' | 'free' | 'clean' | 'issue';

export default function ListPopup({ status }: {
  status?: ListStatus,
}) {
  const [onglet, setOnglet] = React.useState<ListStatus>(status ?? 'all');
  const { setPopup } = useDataContext();
  const { bedRoomTab } = useBedroom();

  const options: {[k in ListStatus] : { value: string, rooms: BedRoom.Type[] }} = {
    'all': { value: "Tout", rooms: bedRoomTab, },
    'sold': { value: "Vendues", rooms: bedRoomTab.filter(room => room.customer), },
    'free': { value: "Disponibles", rooms: bedRoomTab.filter(room => !room.customer) },
    'clean': { value: "Néttoyage", rooms: bedRoomTab.filter(room => room.cleaner) },
    'issue': { value: "En pannes", rooms: bedRoomTab.filter(room => room.issue) },
  }
  const datas = options[onglet].rooms;

  const title = (
    <Title icon={<IoBed size={20} />} right={<ImCross size={13}
      className="text-red-700 cursor-pointer"
      onClick={() => setPopup(null)} />
    }>
      <h1 className="font-bold text-[15px]">Chambres</h1>
    </Title>
  );

  return (
    <Popup onClose={() => setPopup(null)}>
      <PopupBody top={title} className='h-130'>

        <OngletTab onglet={onglet} setOnglet={text => setOnglet(text as ListStatus)}
          datas={ Object.entries(options).map(([key, { value, rooms }]) => ({ key,
            value: <div className='flex flex-row justify-between w-full gap-2'>
              <p>{value}</p><p>{getString(rooms.length) || ''}</p></div>,
          }) ) } subClassName='px-5 py-1 bg-gray-300/40 rounded'>

          <NoElem text="Aucun élément" className='text-[15px]' list={datas}>

            { onglet === 'all' && (
              <TheTable datas={datas}
                top={["Arrivée", "CH", "Client", "Départ"]}>
                { room => [
                  <span>{ room.customer ? getFrenchDateTime(room.customer.date) : ""}</span>,
                  <span className='text-[13px] text-black'>{room.id}</span>,
                  <span>{room.id}</span>,
                  <span>{room.id}</span>,
                ] }
              </TheTable>
            ) }

            { onglet === 'sold' && (
              <TheTable datas={datas}
                top={["Arrivée", "CH", "Client", "Description", "Restaurant"]}>
                { room => [
                  <span>{getFrenchDateTime(room.customer!.date)}</span>,
                  <span className='text-[13px] text-black'>{room.id}</span>,
                  <span>{room.customer!.name}</span>,
                  <span>{room.customer!.description}</span>,
                  <span>{room.restauration.reduce((res, resto) => res + resto.price, 0)}</span>,
                ] }
              </TheTable>
            ) }

            { onglet === 'free' && (
              <TheTable datas={datas}
                top={["Arrivée", "CH", "Client", "Départ"]}>
                { room => [
                  <span>{ room.customer ? getFrenchDateTime(room.customer.date) : ""}</span>,
                  <span className='text-[13px] text-black'>{room.id}</span>,
                  <span>{room.id}</span>,
                  <span>{room.id}</span>,
                ] }
              </TheTable>
            ) }

            { onglet === 'clean' && (
              <TheTable datas={datas}
                top={["Arrivée", "CH", "Client", "Départ"]}>
                { room => [
                  <span>{ room.customer ? getFrenchDateTime(room.customer.date) : ""}</span>,
                  <span className='text-[13px] text-black'>{room.id}</span>,
                  <span>{room.id}</span>,
                  <span>{room.id}</span>,
                ] }
              </TheTable>
            ) }

            { onglet === 'issue' && (
              <TheTable datas={datas}
                top={["Arrivée", "CH", "Client", "Départ"]}>
                { room => [
                  <span>{ room.customer ? getFrenchDateTime(room.issue!.date) : ""}</span>,
                  <span className='text-[13px] text-black'>{room.id}</span>,
                  <span>{room.id}</span>,
                  <span>{room.id}</span>,
                ] }
              </TheTable>
            ) }

          </NoElem>

        </OngletTab>

      </PopupBody>
    </Popup>
  );
}

function TheTable({ top, children, datas }: {
  top: string[],
  datas: BedRoom.Type[],
  children: (d: BedRoom.Type) => React.ReactNode[],
}) {
  const roomStages = Object.groupBy(datas, room => stages[room.stage].name);

  return (
    <table className='[&_td,&_th]:py-1 text-[12px] font-bold text-gray-800'>

      <thead className='font-bold'>
        <tr className='text-[12px]'>{ top.map(elem => <th key={elem}>{elem}</th>) }</tr>
        <tr> <th colSpan={top.length}> <hr className='text-gray-400' /> </th> </tr>
      </thead>

      <tbody className='overflow-auto'> { Object.entries(roomStages).map(([stage, rooms]) =>
        <React.Fragment key={stage}>

          <tr>
            <td colSpan={top.length}>
              <div className='text-left uppercase font-bold flex flex-row justify-between items-center pt-2'>
                <span>{stage}</span>
                <p className='flex justify-center items-center self-end bg-green-800/10 border-1 border-green-800 \
                  py-[1px] px-2 rounded-full text-[11px] text-green-800 float-right font-bold'>{ getString(rooms?.length ?? 0) }
                </p>
              </div>
            </td>
          </tr>

          { rooms?.map((room, i) =>
            <tr key={room.id} className={twMerge('[&_td,&_th]:px-5 [&_td,&_th]:py-2 text-center border-b-1 border-blue-800', i%2===0 ? "bg-blue-600/8" : "")}>
              { children(room).map((elem, i) => <td key={i}>{elem}</td>) }
            </tr>
          ) }

        </React.Fragment> ) }
      </tbody>

    </table>
  );
}

