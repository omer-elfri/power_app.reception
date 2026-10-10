'use client'

import React from "react";
import { twMerge } from "tailwind-merge";
import { room_ctg_datas } from "../configs/room_ctg";
import { useDataContext } from "../hooks";
import { useBedroom } from "../hooks/useBedroom";
import BedRoom from "../types/bedroom";

import SectionBox, { Bar, Title } from "../components/SectionBox";
import LabelInput from "../components/LabelInput";
import MyButton from "../components/MyButton";

import { ImCross } from "react-icons/im"
import { FaCheck } from "react-icons/fa";
import { GiBroom } from "react-icons/gi";
import { TbCancel } from "react-icons/tb";
import { FaExchangeAlt } from "react-icons/fa";

export default function RoomInfos({ room:bedRoom }: {
    room: BedRoom.Type,
}) {
    const { setRoomPopup } = useDataContext();

    return (
        <SectionBox subClassName="gap-4">

            <Title bar right={<ImCross size={13} className="text-red-700 cursor-pointer" onClick={() => setRoomPopup(null)} />} >
                <h1 className="font-bold text-[18px]">CH {bedRoom.id}</h1>
            </Title>

            <div className="flex flex-col gap-y-4 rounded-md font-bold">
                <CheckInBox room={bedRoom} />
                <Bar />
                <ActionBox room={bedRoom} />
            </div>

        </SectionBox>
    );
}

export function CheckInBox({ room:bedRoom }: {
    room: BedRoom.Type,
}) {
    const { check_in } = useBedroom();
    const [sexe, setSexe] = React.useState(bedRoom.checkIn?.sexe);
    const clientName = bedRoom.checkIn?.clientName ?? bedRoom.booked?.clientName ?? "";
    const [name, setName] = React.useState(clientName);
    const [description, setDescription] = React.useState(bedRoom.checkIn?.description);
    const realPrice = React.useMemo(() => (
        bedRoom.checkIn?.price
        ?? room_ctg_datas[ bedRoom.categories[0] ].price
    ), [room_ctg_datas, bedRoom]);
    const [price, setPrice] = React.useState(realPrice);

    React.useEffect(() => {
        setSexe(bedRoom.checkIn?.sexe);
        setName(clientName);
        setPrice(realPrice);
        setDescription(bedRoom.checkIn?.description);
    }, [bedRoom, clientName, realPrice]);

    return (
        <form className="flex flex-col gap-y-2" onSubmit={(e) => {
            e.preventDefault();
            check_in(bedRoom.id, {sexe, clientName: name, price, description});
        }}>

            { bedRoom.issue && <p className={twMerge("rounded px-2 py-1 text-[11px]", bedRoom.issue.priority === "high" ? "bg-red-500/10 text-red-700" :  "bg-yellow-500/10 text-yellow-700")}>{bedRoom.issue?.message}</p> }

            <h2 className="font-bold text-[13px]">Informations client</h2>

            <LabelInput label="Nom complet" required
                subClassName="grid grid-cols-[35px_1fr] grid-rows-[30px] border-1 px-2 rounded">
                <select name="sexe" className="text-[12px] appearance-none !border-0 text-[12px]" value={sexe} onChange={(e) => setSexe(e.target.value as 'Mr' | 'Mme') }>
                    <option value='Mr'>Mr</option>
                    <option value='Mme'>Mme</option>
                </select>
                <input name="fullname" placeholder="Client X" className="!border-0 text-[12px]" required value={name ?? ""} onChange={(e) => setName(e.target.value)} />
            </LabelInput>

            <LabelInput label="Prix unitaire" required>
                <input name="price" type="number" className="text-[13px] text-center px-3 w-full h-7" value={price || ""} onChange={(e) => setPrice(Number(e.target.value))} />
            </LabelInput>

            <LabelInput label="Infos supplémentaires">
                <textarea className="w-full h-25 p-2 text-[11px]" placeholder="IFU / entreprise / autre description" value={description} onChange={(e) => setDescription(e.target.value)} />
            </LabelInput>

            <div className="grid grid-cols-2 gap-2"> { !bedRoom.checkIn
                ? <>
                    <MyButton name="check_in" icon={<FaCheck className="order-1" />} className="col-span-2 self-end bg-green-700/20 text-green-700">Check in</MyButton>
                </> : <>
                    <MyButton name='change_room' icon={<FaExchangeAlt />} className="bg-yellow-700/20 text-yellow-700 border-yellow-700">Déplacer</MyButton>
                    <MyButton name="modify" icon={<FaCheck className="order-1" />} className="bg-green-700/20 text-green-700 border-1 border-green-700">Modifier</MyButton>
                </> }
            </div>

        </form>
    );
}

export function ActionBox({ room:bedRoom }: {
    room: BedRoom.Type,
}) {
    const { check_out } = useBedroom();

    return (
        <div className="flex flex-col gap-2">

            <h2 className="font-bold text-[13px] mb-2">Actions</h2>

            <MyButton name="check_out" icon={<ImCross />}
                disabled={!bedRoom.checkIn}
                onClick={() => check_out(bedRoom.id)}
                className={twMerge("border-1", bedRoom.checkIn
                    ? "bg-red-700/10 border-red-700 text-red-700"
                    : "bg-gray-700/10 border-gray-700 text-gray-700"
            )}>Check out</MyButton>

            { !bedRoom.cleaner ? (
                <MyButton name="clean" icon={<GiBroom />} className="bg-blue-700/20 text-blue-700">Néttoyer</MyButton>
            ) : <div className="grid grid-cols-[1fr_auto_auto] gap-1">
                <MyButton name="cleaning" icon={<GiBroom />} className="border-1 border-blue-700 text-blue-700">{bedRoom.cleaner.valletName}</MyButton>
                <MyButton name="clean_cancel" icon={<ImCross />}  className="bg-red-700/20 text-red-700" />
            </div> }

            <MyButton name="problem" icon={<TbCancel />} className="border-1 border-red-700 text-red-700">Signaler un problème</MyButton>

        </div>
    );
}
