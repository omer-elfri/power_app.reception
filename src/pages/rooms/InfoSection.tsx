"use client"

import BedRoom from "../../types/bedroom";
import SectionBox from "../../components/SectionBox";

import { HiLockClosed } from "react-icons/hi";
import { FaChevronRight } from "react-icons/fa";
import { IconType } from "react-icons/lib";
import { useDataContext } from "../../datas/context";

export default function InfosSection({ roomPopup }: {
    roomPopup: BedRoom.Id,
}) {
    const { bedRooms } = useDataContext();
    const bedRoom = bedRooms[roomPopup];
    return (
        <SectionBox
            title={<h1 className="font-bold text-[18px]">CH {bedRoom.id}</h1>}
            notif={<p className="flex flex-row items-center gap-1 bg-green-400/20 rounded-md p-1">
                <HiLockClosed size={13} className="text-green-600" />
                <span className="text-green-600 text-[11px] ">Standard</span>
            </p>}
            className="w-[350px] sticky top-3"
            subClassName="gap-4">

            <div className="grid grid-cols-2 grid-rows-2 gap-y-5 px-3 py-6 bg-gray-200/50 rounded-md">
                <InfoBox Icon={HiLockClosed} name="Étage" value="1er étage" />
                <InfoBox Icon={HiLockClosed} name="Étage" value="1er étage" />
                <InfoBox Icon={HiLockClosed} name="Étage" value="1er étage" />
                <InfoBox Icon={HiLockClosed} name="Étage" value="1er étage" />
            </div>

            <hr className="text-gray-500/50" />

            <div className="grid grid-cols-3 gap-x-2">
                <StateBox Icon={HiLockClosed} name="Alimentée" value="Oui" />
                <StateBox Icon={HiLockClosed} name="Alimentée" value="Oui" />
                <StateBox Icon={HiLockClosed} name="Alimentée" value="Oui" />
            </div>

            <div className="flex flex-col gap-2">
                <RoomAction Icon={HiLockClosed} name="Alimentée" value="Oui" className="bg-green-400/30" />
                <RoomAction Icon={HiLockClosed} name="Alimentée" value="Oui" className="bg-green-400/30" />
                <RoomAction Icon={HiLockClosed} name="Alimentée" value="Oui" className="bg-green-400/30" />
                <RoomAction Icon={HiLockClosed} name="Alimentée" value="Oui" className="bg-green-400/30" />
            </div>


        </SectionBox>
    );
}

function InfoBox({ Icon, name, value }: {
    Icon: IconType,
    name: string,
    value: string,
}) {
    return (
        <div className="grid grid-cols-[auto_auto] gap-x-1 justify-start">
            <Icon size={40} className="row-span-2 text-gray-400" />
            <h2 className="font-bold text-[11px] text-gray-400/60">{name}</h2>
            <span className="text-[12px]">{value}</span>
        </div>
    );
}

function StateBox({ Icon, name, value }: {
    Icon: IconType,
    name: string,
    value: string,
}) {
    return (
        <div className="grid grid-cols-[auto_auto] justify-start gap-x-2 px-2 py-2 bg-yellow-400 py-1 rounded-md">
            <Icon size={20} className="row-span-2 text-gray-600" />
            <h2 className="text-[10px] text-gray-600/60">{name}</h2>
            <span className="text-[10px]">{value}</span>
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
            <div className="grid grid-cols-[auto_1fr_auto] justify-start items-center gap-x-2 w-full py-1 px-1 text-left text-black">
                <Icon className="row-span-2" size={30} />
                <h2 className="font-bold text-[11px]">{name}</h2>
                <FaChevronRight size={16} className="row-span-2" />
                <span className="text-[10px] text-gray-600">{value}</span>
            </div>
        </button>
    );
}
