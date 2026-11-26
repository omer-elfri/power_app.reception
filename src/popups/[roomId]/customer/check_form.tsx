'use client'

import React from "react";
import { twMerge } from "tailwind-merge";
import BedRoom from "../../../types/bedroom";

import { AsideDiv } from "../../../components/AsideDiv";
import LabelInput from "../../../components/LabelInput";
import { MdPerson } from "react-icons/md";

const style = "!border-gray-400 h-8";

export default function CheckForm({ room:bedRoom, className }: {
    room: BedRoom.Type,
    className?: string,
}) {
    const [_, setFullName] = React.useState("");
    const clientName = bedRoom.customer?.name ?? bedRoom.booked?.name ?? "";
    const realPrice = bedRoom.customer?.price ?? bedRoom.category.price;

    return (
        <AsideDiv icon={<MdPerson />} title="Enrégistrement" className={twMerge("", className)}>

            <div className="grid grid-cols-6 gap-x-2 gap-y-2 text-[12px] [&_input]:shadow-[inset_0_1px_1px_1px_rgba(0,0,0,0.15)]">

                <LabelInput required label="Sexe" name="sexe"
                    defaultValue={bedRoom.customer?.sexe}
                    options={[
                        { k: "Mr", value: "HOMME" },
                        { k: "Mme", value: "FEMME" },
                    ]}
                    className="col-span-2"
                    inputClassName={twMerge("", style)}
                />

                <LabelInput label="Nom de famille" required
                    name="fullname" placeholder="ABOU John"
                    defaultValue={clientName.toUpperCase()}
                    onChangeText={setFullName}
                    className="col-span-4"
                    inputClassName={twMerge("uppercase", style)}
                />

                <LabelInput label="Téléphone" name="tel" type="tel"
                    defaultValue={bedRoom.customer?.tel?.toString()}
                    placeholder="01 .. .. .. .."
                    className="col-span-3"
                    inputClassName={style}
                />

                <LabelInput label="Ville" name="town"
                    defaultValue={bedRoom.customer?.town}
                    placeholder="Cotonou"
                    className="col-span-3"
                    inputClassName={twMerge("py-[5px]", style)}
                />

                <LabelInput label="Raison du séjour" name="reason"
                    className="col-span-4"
                    defaultValue={bedRoom.customer?.reason}
                    inputClassName={twMerge("text-[12px] py-[5px]", style)}
                />

                <LabelInput label="Prix unitaire" name="price"
                    type="number" step={5} min={0} required
                    className="col-span-2"
                    defaultValue={realPrice.toString()}
                    disabled={!!bedRoom.customer}
                    inputClassName={twMerge("text-center text-[15px] py-[5px]", style)}
                />

            </div>

        </AsideDiv>
    );
}

