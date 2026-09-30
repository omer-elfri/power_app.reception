'use client'

import BedRoom from "../../types/bedroom";
import SectionBox, { Title } from "../../components/SectionBox";

import { HiLockClosed } from "react-icons/hi";
import { IconType } from "react-icons/lib";
import { useDataContext } from "../../datas/context";
import { twMerge } from "tailwind-merge";

import { FaRegTrashAlt } from "react-icons/fa"
import { FaPowerOff } from "react-icons/fa"
import { IoPersonOutline } from "react-icons/io5"
import { FaStairs } from "react-icons/fa6"
import { BiCategoryAlt } from "react-icons/bi"
import { room_ctg_datas } from "../../configs/room_ctg";

export default function InfosSection({ roomId }: {
    roomId: BedRoom.Id,
}) {
    const { bedRooms } = useDataContext();
    const bedRoom = bedRooms[roomId];
    return (
        <SectionBox subClassName="gap-4">

            <Title bar
                name={<h1 className="font-bold text-[18px]">CH {bedRoom.id}</h1>}
                notif={<p className="flex flex-row items-center gap-1 bg-green-400/20 rounded-md p-1">
                    <HiLockClosed size={13} className="text-green-600" />
                    <span className="text-green-600 text-[11px] ">Standard</span>
                </p>}
            />

            <div className="grid grid-cols-2 grid-rows-2 gap-x-1 gap-y-2 rounded-md">
                <InfoBox Icon={FaStairs} name="Étage" value="1er étage" />
                <InfoBox Icon={BiCategoryAlt} name="Catégorie" value={<p>{bedRoom.categories.map((ctgId) => <>
                    <p>{room_ctg_datas[ctgId].name}</p>
                </>)}</p>} />
                <InfoBox Icon={HiLockClosed} name="Étage" value="1er étage" />
                <InfoBox Icon={HiLockClosed} name="Étage" value="1er étage" />
            </div> <hr className="text-gray-500/50" />

            <div className="grid grid-cols-3 gap-x-1">
                <StateBox Icon={FaPowerOff} name="Alimentée" value={true} className="bg-green-600/15 text-green-600" />
                <StateBox Icon={FaRegTrashAlt} name="Néttoyage" value={true} className="bg-blue-600/15 text-blue-600" />
                <StateBox Icon={IoPersonOutline} name="Occupation" value={false} className="bg-red-600/15 text-red-600" />
            </div> <hr className="text-gray-400/50" />

            <div className="grid grid-cols-2 gap-2">
                <RoomAction Icon={HiLockClosed} name="Check In" value="Oui" className="text-green-400 bg-green-400/15" />
                <RoomAction Icon={HiLockClosed} name="Check Out" value="Oui" className="text-green-400 bg-red-400/15" />
                <RoomAction Icon={HiLockClosed} name="Néttoyer" value="Oui" className="text-green-400 bg-yellow-400/15 col-span-2" />
                <RoomAction Icon={HiLockClosed} name="Signaler un problème" value="Oui" className="text-green-400 bg-blue-400/15 col-span-2" />
            </div>

        </SectionBox>
    );
}

function InfoBox({ Icon, name, value }: {
    Icon: IconType,
    name: string,
    value: string | React.ReactNode,
}) {
    // return (
    //     <div className="grid grid-cols-[1fr_auto] gap-1">
    //         <h2 className="font-bold text-[11px] text-gray-500">{name}</h2>
    //         <span className="text-[11px]">{value}</span>
    //     </div>
    // );
    return (
        <div className="grid grid-cols-[auto_auto] grid-rows-[auto_1fr] gap-x-2 justify-start pl-1 text-gray-600">
            <Icon size={25} className="row-span-2" />
            <h2 className="font-bold text-[11px]">{name}</h2>
            <div className="text-[11px] text-gray-500">{value}</div>
        </div>
    );
}

function StateBox({ Icon, name, value, className }: {
    Icon: IconType,
    name: string,
    value: boolean,
    className: string,
}) {
    return (
        <div className={twMerge("flex flex-col items-center text-center gap-x-2 px-2 py-2 rounded-md text-gray-600 font-bold", className, !value?"bg-gray-400/20 text-gray-600":"")}>
            <Icon size={18} className="row-span-2 mb-2" />
            <h2 className="text-[9px]">{name}</h2>
            <span className="text-[10px] text-black">{value ? "Oui" : "Non"}</span>
        </div>
    );
}

function RoomAction({ Icon, name, value, className }: {
    Icon: IconType,
    name: string,
    value: string,
    className: string,
}) {
    return (
        <button className={className}>
            <div className="grid grid-cols-[auto_1fr_auto] justify-start items-center gap-x-2 w-full py-1 text-left text-black">
                <Icon className="row-span-2" size={30} />
                <h2 className="font-bold text-[11px]">{name}</h2>
                {/* <FaChevronRight size={16} className="row-span-2" /> */}
                <div />
                <span className="text-[10px] text-gray-600">{value}</span>
            </div>
        </button>
    );
}



export function Popup({ roomId, setRoomPopup }: {
    roomId: BedRoom.Id,
    setRoomPopup: React.Dispatch<React.SetStateAction<BedRoom.Id | null>>,
}) {
    return (
        <div className="flex flex-col justify-center items-center fixed inset-0 bg-black/50" onClick={() => setRoomPopup(null)}>
            <div className="flex flex-col items-center min-w-20 min-h-50 bg-gray-400" onClick={(e) => e.preventDefault()}>
                <InfosSection roomId={roomId} />
            </div>
        </div>
    );
}

export type RoomInfos = {
    powered: string,
    isSolded: boolean,
    cleaning: string,
    coming: BedRoom.ReservationType | null,
    clientName: string | null,
    issueIcon: React.ReactNode | null,
    categoryNames: string,
};
