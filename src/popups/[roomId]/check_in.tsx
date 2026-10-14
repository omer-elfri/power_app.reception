'use client'

import React from "react";
import { twMerge } from "tailwind-merge";
import { room_ctg_datas } from "../../configs/room_ctg";
import { CheckInProps, useBedroom } from "../../hooks/useBedroom";
import BedRoom from "../../types/bedroom";

import FormAside from "../../components/FormAside";
import LabelInput from "../../components/LabelInput";
import MyButton from "../../components/MyButton";

import { FaCheck } from "react-icons/fa";
import { MdPerson } from "react-icons/md";
import { FaExchangeAlt } from "react-icons/fa";

export default function CheckInForm({ room:bedRoom, className }: {
    room: BedRoom.Type,
    className?: string,
}) {
    const { check_in, check_update, check_out } = useBedroom();
    const clientName =
        bedRoom.checkIn?.clientName ??
        bedRoom.booked?.clientName ?? "";
    const realPrice =
        bedRoom.checkIn?.price
        ?? room_ctg_datas[ bedRoom.categories[0] ].price;

    const night = (() => {
        if (!bedRoom.checkIn?.end) return 1;
        const res = bedRoom.checkIn.end.getTime() -
            bedRoom.checkIn.start.getTime();
        return Math.ceil(res / (24*60*60*1000));
    })();

    const handleSubmit = React.useCallback((e: React.SubmitEvent<HTMLFormElement>) => {
        const sexe = e.target.sexe.value as 'Mr' | 'Mme';
        const name = e.target.fullname.value as string;
        const description = e.target.description.value as string;
        const price = e.target.price.value as number;
        const night = e.target.night.value as number;
        const tel = e.target.tel.value as number;
        const town = e.target.town.value as string;

        e.preventDefault();
        if (e.target.check_in) {
            check_in(bedRoom.id, { sexe, clientName: name, price, night, description });
        }
        if (e.target.check_update) {
            check_update(bedRoom.id, { sexe, clientName: name, price, night, description });
        }
        if (e.target.check_out) check_out(bedRoom.id);
    }, [bedRoom.checkIn, check_in, check_update, check_out]);

    const SubmitButtons = React.useCallback(({ className }: {
        className?: string,
    }) => {
        return (
            <div className={twMerge("flex flex-row gap-2", className)}> { !bedRoom.checkIn
                ? <>
                    <MyButton name="check_in" icon={<FaCheck className="order-1" />}
                        className="bg-blue-500 !py-1 text-white uppercase">Check in
                    </MyButton>
                </> : <>
                    <MyButton name='check_out' icon={<FaExchangeAlt />}
                        className="border-1 text-red-700 border-red-700 !py-1">Check out
                    </MyButton>

                    <MyButton name="update_room" icon={<FaCheck className="order-1" />}
                        className="bg-green-700/20 text-green-700 border-1 border-green-700 !py-1">Modifier
                    </MyButton>
                </>  }
            </div>
        );
    }, [bedRoom.checkIn]);

    return (
        <FormAside title="Enrégistrement"
            icon={<MdPerson />}
            className={twMerge("", className)}
            subClassName="gap-6"
            onSubmit={handleSubmit}
            right={<SubmitButtons />}
        >

            { bedRoom.issue &&  <p className={twMerge("rounded px-2 py-1 text-[11px]",
                bedRoom.issue.priority === "high" ? "bg-red-500/10 text-red-700" :  "bg-yellow-500/10 text-yellow-700")}>
                {bedRoom.issue?.message}
            </p> }

            <div className="grid grid-cols-12 gap-x-5 gap-y-2 text-[12px]">
                
                <LabelInput required label="Sexe" name="sexe"
                    defaultValue={bedRoom.checkIn?.sexe}
                    options={[ { k: "Mr" }, { k: "Mme" }, ]}
                    className="col-span-2"
                />
 
                <LabelInput required label="Nom de famille" name="fullname"
                    placeholder="ABOU John"
                    defaultValue={clientName}
                    className="col-span-4"
                    inputClassName="uppercase"
                />

                <LabelInput label="Infos supplémentaires" name='comment' className="col-span-6 row-span-3">
                    <textarea className="p-2 text-[11px] h-full min-h-30 py-[5px]" value={bedRoom.checkIn?.description}
                        placeholder="IFU / entreprise / autre description" id='comment'
                    />
                </LabelInput>

                <LabelInput label="Téléphone"
                    name="tel" type="tel"
                    defaultValue={bedRoom.checkIn?.tel?.toString()}
                    placeholder="01 .. .. .. .."
                    inputClassName=" py-[5px]"
                    className="col-span-3"
                />

                <LabelInput label="Ville"
                    name="town"
                    defaultValue={bedRoom.checkIn?.town}
                    placeholder="Cotonou"
                    inputClassName=" py-[5px]"
                    className="col-span-3"
                />

                <LabelInput label="Prix unitaire"
                    step={5} min={0} required
                    className="col-span-4"
                    name="price" type="number"
                    value={realPrice.toString()}
                    inputClassName="text-center text-[12px]"
                />

                <LabelInput label="Nuitée"
                    className="col-span-2"
                    type="number" min={1} step={1}
                    name="night" value={night.toString()}
                    inputClassName="py-[5px]"
                />

            </div>

        </FormAside>
    );
}
