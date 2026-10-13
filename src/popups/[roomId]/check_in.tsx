'use client'

import React from "react";
import { twMerge } from "tailwind-merge";
import { room_ctg_datas } from "../../configs/room_ctg";
import { useBedroom } from "../../hooks/useBedroom";
import BedRoom from "../../types/bedroom";

import LabelInput from "../../components/LabelInput";
import MyButton from "../../components/MyButton";

import { FaCheck } from "react-icons/fa";
import { FaExchangeAlt } from "react-icons/fa";

export default function CheckInTab({ room:bedRoom }: {
    room: BedRoom.Type,
}) {
    const clientName =
        bedRoom.checkIn?.clientName ??
        bedRoom.booked?.clientName ?? "";
    const realPrice =
        bedRoom.checkIn?.price
        ?? room_ctg_datas[ bedRoom.categories[0] ].price;
 
    const { bedRooms, bedRoomTab, check_in, check_out, check_move } = useBedroom();
    const [sexe, setSexe] = React.useState(bedRoom.checkIn?.sexe);
    const [name, setName] = React.useState(clientName);
    const [description, setDescription] = React.useState(bedRoom.checkIn?.description);
    const [price, setPrice] = React.useState(realPrice);
    const [night, setNight] = React.useState(1);
    const [tel, setTel] = React.useState("");
    const [town, setTown] = React.useState("");

    React.useEffect(() => {
        setSexe(bedRoom.checkIn?.sexe);
        setName(clientName);
        setPrice(realPrice);
        if (bedRoom.checkIn?.end) {
            const res = bedRoom.checkIn.end.getTime() -
                bedRoom.checkIn.start.getTime();
            const newNight = res / (24*60*60*1000);
            console.log("newNight", newNight)
            setNight( newNight );
        }
        setDescription(bedRoom.checkIn?.description);
    }, [bedRoom, clientName, realPrice]);

    // night

    return (
        <div className="flex flex-col gap-y-2">
            <div className="flex flex-col gap-y-5">

                <Aside title="Enrégistrement" onSubmit={e => {
                    e.preventDefault();
                    if (e.target.check_in)
                        check_in(bedRoom.id, {sexe, clientName: name, price, night, description});
                    if (e.target.check_out)
                        check_out(bedRoom.id);
                }}>
                    { bedRoom.issue &&  <p className={twMerge("rounded px-2 py-1 text-[11px]",
                        bedRoom.issue.priority === "high" ? "bg-red-500/10 text-red-700" :  "bg-yellow-500/10 text-yellow-700")}>
                        {bedRoom.issue?.message}
                    </p> }

                    <div className="grid grid-cols-2 gap-x-5 gap-y-2 text-[12px]">
                        
                        <LabelInput required label="Nom de famille" name="name">
                            <div className="grid grid-cols-[35px_1fr] border-1 px-2 rounded py-[5px]">
                                <select name="sexe" value={sexe} required
                                    className="appearance-none !border-0" id='name'
                                    onChange={(e) => setSexe(e.target.value as 'Mr' | 'Mme') }>
                                    <option value='Mr'>Mr</option>
                                    <option value='Mme'>Mme</option>
                                </select>
                                <input name="name" placeholder="ABOU John" required
                                    className="!border-0 uppercase" value={name}
                                    onChange={e => setName(e.target.value)}
                                />
                            </div>
                        </LabelInput>

                        <div className="grid grid-cols-[70px_1fr] gap-2">
                            <LabelInput label="Nuitée"
                                type="number" min={1} step={1}
                                name="night" value={night.toString()}
                                onChangeText={text => setNight(Number(text))}
                                inputClassName="py-[5px]"
                            />
                            <LabelInput label="Prix unitaire" step={5}
                                required name="price" type="number" value={price.toString()}
                                inputClassName="text-center text-[12px]"
                                onChangeText={text => setPrice(Number(text))}
                            />
                        </div>

                        <LabelInput label="Téléphone"
                            name="tel" type="tel" value={tel}
                            onChangeText={setTel}
                            placeholder="01 .. .. .. .."
                            inputClassName=" py-[5px]"
                        />

                        <LabelInput label="Infos supplémentaires" name='comment' className="row-span-2">
                            <textarea className="p-2 text-[11px] h-full py-[5px]" value={description}
                                placeholder="IFU / entreprise / autre description" id='comment'
                                onChange={e => setDescription(e.target.value)}
                            />
                        </LabelInput>

                        <LabelInput label="Ville"
                            name="town" value={town}
                            onChangeText={setTown}
                            placeholder="Cotonou"
                            inputClassName=" py-[5px]"
                        />

                        <div className="flex flex-row justify-end gap-2 mt-5 col-span-2"> { !bedRoom.checkIn
                            ? <>
                                <MyButton name="check_in" icon={<FaCheck className="order-1" />} className="self-end bg-black text-white uppercase">Check in</MyButton>
                            </> : <>
                                <MyButton name='check_out' icon={<FaExchangeAlt />} className="border-1 text-red-700 border-red-700">Check out</MyButton>
                                <MyButton name="update_room" icon={<FaCheck className="order-1" />} className="bg-green-700/20 text-green-700 border-1 border-green-700">Modifier</MyButton>
                            </> }
                        </div>

                    </div>


                </Aside>

                { bedRoom.checkIn && <Aside title="Changer de chambre" onSubmit={e => {
                    e.preventDefault();
                    const roomId = e.target.roomId.value as BedRoom.Id;
                    const description = e.target.description.value as BedRoom.Id;
                    if (bedRooms[roomId].checkIn) throw Error(`La chambre ${roomId} est déjà occupée`);
                    check_move(bedRoom.id, roomId, description);
                }} subClassName="flex flex-col gap-2"
                    right={<>
                    <LabelInput name="roomId" className="w-20"
                        options={ bedRoomTab.map(room => ({
                            k: room.id, disabled: !!room.checkIn })) }
                    />
                        <MyButton name='change_room' icon={<FaExchangeAlt />} className="bg-yellow-700/10 text-yellow-700 border-yellow-700">Déplacer</MyButton>
                    </>
                    }>

                    <LabelInput label="Pourquoi ?" name="description" required>
                        <textarea className="h-20" name="description" />
                    </LabelInput>
                </Aside> }

            </div>

        </div>
    );
}

function Aside({ title, right, className, subClassName, children, onSubmit }: {
    title: string,
    right?: React.ReactNode,
    className?: string,
    subClassName?: string,
    children?: React.ReactNode,
    onSubmit: (e: React.SubmitEvent<HTMLFormElement>) => void,
}) {
    return (
        <form className={twMerge("flex flex-col gap-y-2 bg-white/60 px-3 py-3 rounded", className)} onSubmit={onSubmit}>
            <div className="flex flex-row gap-2 justify-between items-center">
                <h2 className="text-[15px]">{title}</h2>
                <div className="flex-1" />
                { right }
            </div>
            <div className={twMerge("", subClassName)}>
                { children }
            </div>
        </form>
    );
}

