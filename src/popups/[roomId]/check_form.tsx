'use client'

import React from "react";
import { twMerge } from "tailwind-merge";
import BedRoom from "../../types/bedroom";

import { AsideDiv } from "../../components/AsideDiv";
import LabelInput from "../../components/LabelInput";
import { FaRegComment } from "react-icons/fa";
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

            <div className="grid grid-cols-6 gap-x-2 gap-y-2 text-[12px]">

                <LabelInput required label="Sexe" name="sexe"
                    defaultValue={bedRoom.customer?.sexe}
                    options={[ { k: "Mr" }, { k: "Mme" }, ]}
                    className="col-span-2"
                    inputClassName={style}
                />

                <LabelInput required label="Nom de famille" name="fullname"
                    placeholder="ABOU John" defaultValue={clientName}
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
                    inputClassName={twMerge("text-center text-[12px] py-[5px]", style)}
                />

            </div>

        </AsideDiv>
    );
}

export function CheckInComment({ room:bedRoom, className }: {
    room: BedRoom.Type,
    className?: string,
}) {
    return (
        <AsideDiv icon={<FaRegComment />} title="Commentaire" className={twMerge("", className)} >

            <LabelInput type='textarea' label="Infos supplémentaires" name='description'
                className={twMerge("text-[11px] min-h-30 bg-gray-200/20", style)}
                inputClassName=""
                defaultValue={bedRoom.customer?.description}
                // placeholder="IFU / entreprise / autre description"
            />

        </AsideDiv>
    );
}

