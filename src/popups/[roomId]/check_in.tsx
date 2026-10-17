'use client'

import React from "react";
import { twMerge } from "tailwind-merge";
import { room_ctg_datas } from "../../configs/room_ctg";
import { useBedroom } from "../../hooks/useBedroom";
import BedRoom from "../../types/bedroom";

import FormAside from "../../components/FormAside";
import LabelInput from "../../components/LabelInput";
import MyButton from "../../components/MyButton";

import { FaCheck } from "react-icons/fa";
import { MdPerson } from "react-icons/md";
import { FaExchangeAlt } from "react-icons/fa";
import { Sex } from "../../types";
import { useDataContext } from "../../hooks";

export default function CheckInForm({ room:bedRoom, className }: {
    room: BedRoom.Type,
    className?: string,
}) {
    const { addPopup, setAlert } = useDataContext();
    const { check_in, check_update, check_out } = useBedroom();
    const clientName =
        bedRoom.customer?.name ??
        bedRoom.booked?.name ?? "";
    const realPrice =
        bedRoom.customer?.price
        ?? room_ctg_datas[ bedRoom.categories[0] ].price;

    const handleSubmit = React.useCallback((e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        const sexe = e.target.sexe.value as Sex;
        const name = e.target.fullname.value as string;
        const description = e.target.description.value as string;
        const price = e.target.price.value as number;
        const tel = e.target.tel.value as number;
        const town = e.target.town.value as string;

        if (e.target.check_in) {
            if (name === "") {
                setAlert(['error', "Vous devez renseigner le nom du client"]);
                throw Error("Vous devez renseigner le nom du client");
            }
            check_in(bedRoom.id, { sexe, name, tel, town, price }, description);
        }
        if (e.target.check_update) {
            if (!bedRoom.customer) throw Error(`La chambre ${bedRoom.id} n'est pas occupée`);
            check_update(bedRoom.customer.id, { sexe, name, tel, town }, description);
        }
    }, [bedRoom.customer, check_in, check_update, check_out]);

    const SubmitButtons = React.useCallback(({ className }: {
        className?: string,
    }) => {
        return (
            <div className={twMerge("flex flex-row gap-2", className)}> { !bedRoom.customer
                ? <>
                    <MyButton name="check_in" icon={<FaCheck className="order-1" />}
                        className="bg-blue-500 !py-1 text-white uppercase">Check in
                    </MyButton>
                </> : <>
                    <MyButton name='check_out' icon={<FaExchangeAlt />} onClick={() => {
                        if (!bedRoom.customer) throw Error(
                            `La chambre ${bedRoom.id} n'est pas occupée`);
                        check_out(bedRoom.customer.id);
                        addPopup(['CLEAN']);
                    }}
                        className="bg-transparent border-1 text-red-700 border-red-700 !py-1">Check out
                    </MyButton>

                    <MyButton name="check_update" icon={<FaCheck className="order-1" />}
                        className="bg-green-700/20 text-green-700 border-1 border-green-700 !py-1">Modifier
                    </MyButton>
                </>  }
            </div>
        );
    }, [bedRoom.customer]);

    return (
        <FormAside title="Enrégistrement"
            icon={<MdPerson />}
            className={twMerge("", className)}
            subClassName="gap-3"
            onSubmit={handleSubmit}
            right={<SubmitButtons />}
        >

            { bedRoom.issue &&  <p className={twMerge("rounded px-2 py-1 text-[11px]",
                bedRoom.issue.priority === "high" ? "bg-red-500/10 text-red-700" : "bg-yellow-500/10 text-yellow-700")}>
                {bedRoom.issue?.message}
            </p> }

            <div className="grid grid-cols-2 gap-5 text-[12px]">

                <div className="grid grid-cols-6 gap-x-5 gap-y-2">
                    
                    <LabelInput required label="Sexe" name="sexe"
                        defaultValue={bedRoom.customer?.sexe}
                        options={[ { k: "Mr" }, { k: "Mme" }, ]}
                        className="col-span-2"
                    />
    
                    <LabelInput required label="Nom de famille" name="fullname"
                        placeholder="ABOU John" defaultValue={clientName}
                        className="col-span-4" inputClassName="uppercase"
                    />

                    <LabelInput label="Téléphone"
                        name="tel" type="tel"
                        defaultValue={bedRoom.customer?.tel?.toString()}
                        placeholder="01 .. .. .. .."
                        inputClassName=" py-[5px]"
                        className="col-span-3"
                    />

                    <LabelInput label="Ville" name="town"
                        defaultValue={bedRoom.customer?.town}
                        placeholder="Cotonou"
                        inputClassName=" py-[5px]"
                        className="col-span-3"
                    />

                    <LabelInput label="Prix unitaire" name="price"
                        type="number" step={5} min={0} required
                        className="col-span-6"
                        defaultValue={realPrice.toString()}
                        inputClassName="text-center text-[12px]"
                        disabled={!!bedRoom.customer}
                    />

                </div>

                <LabelInput label="Infos supplémentaires" name='description'>
                    <textarea id='description'
                        className="p-2 text-[11px] h-full min-h-30 py-[5px]"
                        defaultValue={bedRoom.customer?.description}
                        placeholder="IFU / entreprise / autre description"
                    />
                </LabelInput>

            </div>


        </FormAside>
    );
}
