'use client';

import { useRequest } from '../../../hooks/useRequest';
import { useVisual } from '../../../hooks/useVisual';
import BedRoom from '../../../types/bedroom';

import MyButton from '../../../components/MyButton';
import { ImCross } from 'react-icons/im';
import { FaCheck } from 'react-icons/fa';

export default function BottomButtons({ room:bedRoom }: {
  room: BedRoom.Type,
}) {
  const { addPopup } = useVisual();
  const { clean_done, clean_cancel } = useRequest();

  return (
    <div className='grid grid-cols-2 gap-3'>
      { !bedRoom.cleaning ? <>
        <div />
        <MyButton
          className='uppercase !text-[10px] bg-blue-500 text-white !px-2 !py-1 gap-x-1'
          onClick={() => addPopup(['VALLET', bedRoom.id])}>Néttoyer
        </MyButton>

      </> : <>
        <MyButton icon={<ImCross size={10} />}
          className='!text-[10px] border-1 border-red-500 text-red-500 bg-transparant !px-2 !py-1 gap-x-1'
          onClick={() => clean_cancel(bedRoom.id)}>Annuler
        </MyButton>

        <MyButton iconRight={<FaCheck size={12} />}
          className='!text-[10px] text-blue-500 !px-2 !py-[2px] gap-x-1'
          onClick={() => clean_done(bedRoom.id)}>Terminer
        </MyButton>
      </> }

    </div>
  );
}

