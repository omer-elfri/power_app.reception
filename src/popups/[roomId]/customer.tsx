'use client'

import React from "react";
import { twMerge } from "tailwind-merge";
import { useDataContext } from "../../hooks";
import { useBedroom } from "../../hooks/useBedroom";
import { getFrenchDateTime } from "../../tools/date";
import BedRoom from "../../types/bedroom";

import FormAside from "../../components/FormAside";
import LabelValue from "../../components/LabelValue";
import MyButton from "../../components/MyButton";
import NoElem from "../../components/NoElem";

import { FaCheck } from "react-icons/fa";
import { MdPerson } from "react-icons/md";
import { FaExchangeAlt } from "react-icons/fa";

export default function CheckInInfos({ room:bedRoom, className }: {
    room: BedRoom.Type,
    className?: string,
}) {
    const { addPopup } = useDataContext();
    const { check_out } = useBedroom();

    return (
        <FormAside icon={<MdPerson className="text-gray-500" />} title="Informations client"
            right={
                <MyButton name='check_out' icon={<FaExchangeAlt />}
                    onClick={() => {
                        if (!bedRoom.customer) throw Error(`La chambre ${bedRoom.id} n'est pas occupée`);
                        check_out(bedRoom.customer.id);
                        if (!bedRoom.cleaner) addPopup(['VALLET', bedRoom.id]);
                    }}
                    className="bg-transparent border-1 text-red-700 border-red-700 !py-1 !px-1 !text-[10px]">Check out
                </MyButton>
            }
            className={twMerge("", className)} subClassName="gap-3"
            // bottom={<SubmitButtons room={bedRoom} />}
            >
            <NoElem list={bedRoom.customer ? [1] : []} text="Aucun client">

                <div className="flex flex-col gap-2">
                    <LabelValue label="Arrivée">{bedRoom.customer ? getFrenchDateTime(bedRoom.customer?.date) : '...'}</LabelValue>
                    <LabelValue label="Client">{bedRoom.customer?.sexe} {bedRoom.customer?.name}</LabelValue>
                    <LabelValue label="Téléphone">{bedRoom.customer?.tel}</LabelValue>
                    <LabelValue label="Ville">{bedRoom.customer?.town}</LabelValue>
                    <LabelValue label="Prix unitaire">{bedRoom.customer?.price}</LabelValue>
                    <LabelValue label="Informations supplémentaires"
                        className="flex-wrap min-h-10">
                        {bedRoom.customer?.description}
                    </LabelValue>
                </div>

            </NoElem>
        </FormAside>
    );
}

export function SubmitButtons({ room:bedRoom, className }: {
    className?: string,
    room: BedRoom.Type,
}) {
    const { addPopup } = useDataContext();
    const { check_out } = useBedroom();

    return (
        <div className={twMerge("grid grid-cols-2 gap-2", className)}>

            <MyButton name='check_out' icon={<FaExchangeAlt />}
                onClick={() => {
                    if (!bedRoom.customer) throw Error(`La chambre ${bedRoom.id} n'est pas occupée`);
                    check_out(bedRoom.customer.id);
                    if (!bedRoom.cleaner) addPopup(['VALLET', bedRoom.id]);
                }}
                className="bg-transparent border-1 text-red-700 border-red-700 !py-1">Check out
            </MyButton>

            { !bedRoom.customer
            ? <>
                <MyButton name="check_in" icon={<FaCheck className="" />}
                    className="bg-blue-500 !py-1 text-white uppercase">Check in
                </MyButton>
            </> : <>
                <MyButton name="check_update" iconRight={<FaCheck className="" />}
                    className="bg-green-700/20 text-green-700 border-1 border-green-700 !py-0">Modifier
                </MyButton>
            </>  }
        </div>
    );
}
