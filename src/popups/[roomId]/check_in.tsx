'use client'

import { twMerge } from "tailwind-merge";
import { useDataContext } from "../../hooks";
import { useRequest } from "../../hooks/useRequest";
import BedRoom from "../../types/bedroom";

import LabelInput from "../../components/LabelInput";
import MyButton from "../../components/MyButton";
import { FaCheck, FaExchangeAlt } from "react-icons/fa";
import { MdPerson } from "react-icons/md";
import { AsideDiv } from "../../components/FormAside";

const style = "!border-gray-400 h-8 shadow-[inset_0_1px_1px_1px_rgba(0,0,0,0.15)]";

export default function CheckInForm({ room:bedRoom, className }: {
    room: BedRoom.Type,
    className?: string,
}) {
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
        <AsideDiv icon={<MdPerson />} title="Commentaire"
            className={twMerge("", className)} >

            <LabelInput label="Infos supplémentaires" name='description'>
                <textarea id='description'
                    className={twMerge("p-2 text-[11px] h-full min-h-30 py-[5px] bg-gray-200/20", style)}
                    defaultValue={bedRoom.customer?.description}
                    placeholder="IFU / entreprise / autre description"
                />
            </LabelInput>

        </AsideDiv>
    );
}


export function SubmitButtons({ room:bedRoom, className }: {
    className?: string,
    room: BedRoom.Type,
}) {
    const { addPopup } = useDataContext();
    const { check_out } = useRequest();

    return (
        <div className={twMerge("grid grid-cols-2 gap-2", className)}>

            <MyButton name='check_out' icon={<FaExchangeAlt />} disabled={!bedRoom.customer}
                onClick={() => {
                    if (!bedRoom.customer) throw Error(`La chambre ${bedRoom.id} n'est pas occupée`);
                    check_out(bedRoom.customer.id);
                    if (!bedRoom.clean) addPopup(['VALLET', bedRoom.id]);
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

