'use client';

import { twMerge } from 'tailwind-merge';
import { useVisual } from '../../hooks/useVisual';
import { useRequest } from "../../hooks/useRequest";
import BedRoom from '../../types/bedroom';

import { AsideDiv } from '../../components/AsideDiv';
import { MdError, MdWarning } from 'react-icons/md';

export default function IssueSide({ roomId:bedRoomId }: {
  roomId: BedRoom.Id,
}) {
  const {  addPopup } = useVisual();
  const { isObsolet,bedRooms } = useRequest();
  const bedRoom = bedRooms[bedRoomId];

  return (
    <AsideDiv icon={<MdWarning size={15} className="text-gray-600" title="A besoin de néttoyage" />}
      title="A votre attention" subClassName='flex flex-row flex-wrap gap-2'>

      { bedRoom.issue && <p className={twMerge("grid grid-cols-[auto_1fr] items-center gap-2 rounded px-2 py-1 text-[11px]",
          bedRoom.issue.priority === "high" ? "bg-red-600/20" : "bg-yellow-600/20")}>
          { bedRoom.issue.priority === 'low' && <MdWarning size={18} className="text-yellow-600" /> }
          { bedRoom.issue.priority === 'medium' && <MdWarning size={18} className="text-red-600" /> }
          { bedRoom.issue.priority === 'high' && <MdError size={18} className="text-red-600" /> }
          { bedRoom.issue.message }
      </p> }

      { isObsolet(bedRoomId) && (
        <div className='grid grid-cols-[auto_1fr] items-center gap-2 py-1 px-2 rounded bg-yellow-600/20 font-bold cursor-pointer '
          onClick={() => addPopup(['VALLET', bedRoomId])}>
          <MdWarning size={18} className="text-yellow-600" title="A besoin de néttoyage" />
          <p className='text-gray-800 text-[11px]'>Cette chambre à besoin d'être néttoyer</p>
        </div>
      ) }

    </AsideDiv>
  );
}
