'use client';

import React from "react";
import { twMerge } from "tailwind-merge";
import { useDataContext } from "../../hooks";
import Popup, { PopupBody } from "..";

import MyButton from "../../components/MyButton";
import { Title } from "../../components/SectionBox";
import LabelInput from "../../components/LabelInput";

import { DayPicker } from "@daypicker/react";
import { ImCross } from "react-icons/im";
import CleaningTable from "./table";
import CleaningForm from "./form";
import { ValletLine } from "./vallet";
import Employer from "../../types/employer";
import BedRoom from "../../types/bedroom";



export default function CleaningPopup({ roomId }: {
  roomId?: BedRoom.Id,
}) {
  const { cleaning_book, setPopup, cleaners } = useDataContext();
  const [selectedDate, setSelectedDate] = React.useState<Date>();

  const title = (
    <Title bar className="gap-2"
      right={<MyButton name="close" icon={<ImCross size={10} />}
        className="bg-red-700/10 text-[11px] text-red-700 p-2 rounded"
        onClick={() => setPopup(null)}
      />}>Entretien
    </Title>
  );

  const cleanedAtDate = cleaning_book.get.filter(clean => {
    if (!selectedDate) return true;
    return (
      clean.date.getDate() === selectedDate.getDate() ||
      clean.done?.getDate() === selectedDate.getDate()
    );
  });

  return (
    <Popup onClose={() => setPopup(null)}>
      <PopupBody top={title} className="gap-3">

        <div className="flex-1 w-full h-full grid grid-cols-[230px_1fr] grid-rows-[280px_260px_auto] gap-2 gap-x-5">

          <CleaningForm roomId={roomId} />

          <CleaningTable className="row-span-2" list={cleanedAtDate} />

          <LabelInput label="Période">
            <div className="shadow-[inset_0_2px_4px_4px__rgba(0,0,0,0.15)] rounded px-3 py-1">
              <DayPicker mode="single" className="my-calendar" required
                selected={selectedDate} onSelect={setSelectedDate}
                disabled={{ after: new Date() }}
              />
            </div>
          </LabelInput>

          {/* <ValletAside /> */}

          {/* <div className="row-span-3"></div> */}

          <div className="grid grid-cols-3 gap-3 px-2 py-3 col-span-full sticky bottom-0 bg-white">
            { cleaners.map((cleaner, i) =>
              <ValletLine key={cleaner.id} cleanerId={cleaner.id as Employer.Id}
                className={twMerge("p-2", (i !== cleaners.length-1) ? "border-r-1" : "")} />
            ) }
          </div>

        </div>



        {/* <div className="grid grid-cols-[2fr_3fr] items-start gap-5 flex-1">

          <div className="flex flex-col gap-5">

            <LabelInput label="Période">
              <div className="shadow-[inset_0_2px_4px_4px__rgba(0,0,0,0.15)] rounded px-3 py-1">
                <DayPicker mode="range" className="my-calendar" min={1} required
                  selected={selectedDate} onSelect={setSelectedDate}
                  disabled={{ after: new Date() }}
                />
              </div>
            </LabelInput>

          </div>

          <CleaningTable className="overflow-hidden row-span-3 max-h-full" list={cleanedAtDate} />

        </div> */}


      </PopupBody>
    </Popup>
  );
}
