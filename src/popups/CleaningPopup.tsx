'use client';

import React from "react";
import { twMerge } from "tailwind-merge";
import Popup, { PopupBody } from ".";
import { useDataContext } from "../hooks";
import { useBedroom } from "../hooks/useBedroom";

import { employers_datas } from "../configs/employer";
import Employer from "../types/employer";

import MyButton from "../components/MyButton";
import { Bar, Title } from "../components/SectionBox";
import LabelInput from "../components/LabelInput";
import { FaCheck } from "react-icons/fa";
import { ImCross } from "react-icons/im";

export default function CleaningPopup() {
  const { setCleaningPopup } = useDataContext();

  return (
    <Popup onClose={() => setCleaningPopup(false)}>
      <PopupBody className="gap-3"
        top={<Title bar
          right={<MyButton name="close" icon={<ImCross size={10} />}
            className="bg-red-700/10 text-[11px] text-red-700 p-2 rounded"
            onClick={() => setCleaningPopup(false)}
          />}
          className="gap-2">Entretien
        </Title>}>

        <div className="flex flex-col gap-5 flex-1">
          <Form />
          <Table className="flex-1 overflow-hidden" />
        </div>
      </PopupBody>
    </Popup>
  );
}

function Form({ className }: {
  className?: string,
}) {
  const { bedRoomTab } = useBedroom();

  return (
    <form className={twMerge("grid grid-cols-[80px_1fr_auto] gap-2 rounded-md bg-gray-100/50 p-3", className)}>

      <LabelInput label="Chambre" name="roomId" options={
          bedRoomTab.map(room => ({ k: room.id, value: room.id, disabled: !!room.cleaner }))
      } required />

      <LabelInput label="Vallet" name="vallet" options={
          Object.entries(employers_datas)
          .filter(([_, employer]) => {
            const rules = employer.rules as Employer.Rule[];
            return rules.includes(Employer.Rule.CLEANER)
          })
          .map(([id, employer]) => ({ k: id, value: employer.name }))
      } required />

      <MyButton name="clean_ch" className="self-end bg-blue-700/10 text-blue-700 border-1 border-blue-700">Ajouter</MyButton>

    </form>
  );
}

function Table({ className }: {
  className?: string,
}) {
  const { bedRoomTab } = useBedroom();

  const TableTr = React.useCallback(({ className, children, index=-1 }: {
    children: React.ReactNode[];
    index?: number,
    className?: string,
  }) => {
    return (
        <div className={twMerge("grid grid-cols-[50px_60px_1fr_70px] items-center gap-x-3 py-2 relative text-[11px]",
          className, index%2===0 ? "bg-blue-700/10" : "")}>
          { children }
        </div>
    )
  }, []);

  return (
    <div className={twMerge("flex flex-col gap-2 text-[13px] text-center font-bold", className)}>

      <TableTr className="py-0">
        <p>Heure</p><p>Chambre</p><p>Vallet</p><p>État</p>
      </TableTr> <Bar />

      <div className="flex flex-col overflow-auto">
        { bedRoomTab.filter(room => room.cleaner)
          .sort((a, b) => (a.cleaner!.date.getTime() - b.cleaner!.date.getTime()))
          .map((room, i) =>
            <TableTr index={i}>
              {/* <p className="text-gray-600">{getTime(room.cleaner!.start.date)}</p> */}
              <p className="text-gray-600"></p>
              <p className="">{room.id}</p>
              <p className="">{room.cleaner?.valletName}</p>
              <p className="flex flex-row justify-center items-center gap-2">
                { !room.cleaner
                  ? <FaCheck size={9} title="Fait" className="absolute bottom-1 right-2 text-green-700" />
                  : <ImCross size={9} title="Annuler" className="text-red-400" /> }
              </p>
            </TableTr>
        ) }
      </div>

    </div>
  );
}
