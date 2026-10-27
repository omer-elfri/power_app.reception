'use client';

import { twMerge } from 'tailwind-merge';

import { useBedroom } from "../../hooks/useBedroom";
import BedRoom from '../../types/bedroom';

import { MdWarning } from 'react-icons/md';
import FormAside from '../../components/FormAside';
import { useDataContext } from '../../hooks';

export default function IssueSide({ roomId:bedRoomId }: {
  roomId: BedRoom.Id,
}) {
  const { isObsolet, addPopup } = useDataContext();
  const { bedRooms } = useBedroom();
  const bedRoom = bedRooms[bedRoomId];

  return (
    <FormAside icon={<MdWarning size={15} className="text-gray-600" title="A besoin de néttoyage" />}
      title="A votre attention" subClassName='flex flex-row flex-wrap gap-2'>

      { bedRoom.issue && <p className={twMerge("rounded px-2 py-1 text-[11px]",
          bedRoom.issue.priority === "high" ? "bg-red-600/20 text-red-700" : "bg-yellow-600/20 text-yellow-700")}>
          {bedRoom.issue?.message}
      </p> }

      { isObsolet(bedRoomId) && (
        <div className='grid grid-cols-[auto_1fr] items-center gap-2 py-1 px-2 rounded bg-yellow-600/20 font-bold cursor-pointer '
          onClick={() => addPopup(['VALLET', bedRoomId])}>
          <MdWarning size={18} className="text-yellow-600" title="A besoin de néttoyage" />
          <p className='text-gray-800 text-[11px]'>Cette chambre à besoin d'être néttoyer</p>
        </div>
      ) }

    </FormAside>
  );
}
