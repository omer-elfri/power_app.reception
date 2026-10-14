'use client';

import Popup, { PopupBody } from "..";
import { useDataContext } from "../../hooks";

import MyButton from "../../components/MyButton";
import { Title } from "../../components/SectionBox";

import { ImCross } from "react-icons/im";
import CleaningTable from "./table";
import CleaningForm from "./form";
import ValletAside from "./vallet";


export default function CleaningPopup() {
  const { setCleaningPopup, obsoletRooms } = useDataContext();

  const title = (
    <Title bar className="gap-2"
      right={<MyButton name="close" icon={<ImCross size={10} />}
        className="bg-red-700/10 text-[11px] text-red-700 p-2 rounded"
        onClick={() => setCleaningPopup(false)}
      />}>Entretien
    </Title>
  );

  return (
    <Popup onClose={() => setCleaningPopup(false)}>
      <PopupBody top={title} className="gap-3">

        <div className="grid grid-cols-[2fr_3fr] grid-rows-[auto_1fr] items-start gap-5 flex-1">
          { obsoletRooms.length > 0 && (
            <div className="flex flex-col gap-2 font-bold bg-red-700/10 px-3 py-2 rounded text-start">
              <h2 className="text-[12px]">Ces chambres sont obsolètes</h2>
              <p className="text-[10px]">{obsoletRooms.join(", ")}</p>
            </div>
          ) }
          <CleaningTable className="flex-1 overflow-hidden row-span-3" />
          <CleaningForm />
          <ValletAside />
        </div>
      </PopupBody>
    </Popup>
  );
}
