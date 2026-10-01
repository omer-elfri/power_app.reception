'use client'

import { twMerge } from "tailwind-merge";
import BedRoom from "../../../types/bedroom";

import SectionBox, { Title } from "../../../components/SectionBox";
import { ImCross } from "react-icons/im";
import { FaCheck } from "react-icons/fa";
import LabelInput from "../../../components/LabelInput";
import { formatPrice } from "../../../tools";

export default function ClientSection({ room:bedRoom, className }: {
    room: BedRoom.Type,
    className?: string,
}) {
    return (
        <SectionBox className={twMerge("", className)} subClassName="overflow-auto">
            <Title bar>Enrégistrement</Title>

            <form className="grid grid-cols-6 gap-x-3 gap-y-6 rounded-md" onSubmit={(e) => {
                e.preventDefault();
            }}>
                <LabelInput label="Sexe" name="sexe" className="col-span-2"
                    defaultVal={bedRoom.check_in?.sexe} options={[
                    { k: 'Mr', value: "Mr", },
                    { k: 'Mme', value: "Mme", },
                ]} required />

                <LabelInput required
                    label="Nom complet" name="fullname"
                    className="col-span-4"
                    defaultVal={bedRoom.check_in?.name}
                />

                <LabelInput required
                    label="Prix unitaire" name="price"
                    type="number" className="col-span-3"
                    defaultVal={bedRoom.check_in?.price.toString()}
                />

                <LabelInput required
                    label="Nuitée" name="nuitee"
                    type="number" className="col-span-3"
                    defaultVal={bedRoom.check_in?.nuitee}
                />

                <div className="col-span-6 flex flex-col gap-3">

                    <div className="flex flex-row justify-between gap-2 font-bold">
                        <h3 className="text-[16px]">Total</h3>
                        <p>{formatPrice(3000000)}</p>
                    </div>

                    <div className="grid grid-cols-1 gap-2">
                        { !bedRoom.check_in ? (
                            <button type='submit' className="col-span-2 flex flex-row justify-center bg-green-700/20 text-green-700">
                                <span>Check in</span> <FaCheck />
                            </button>
                        ) : <>
                            <button type='submit' className="flex flex-row justify-center border-1 border-red-700 text-red-700">
                                <span>Check out</span> <ImCross />
                            </button>
                            <button type='submit' className="flex flex-row justify-center bg-yellow-700/20 text-yellow-700 border-yellow-700">Changer de chambre</button>
                            <button type='submit' className="flex flex-row justify-center bg-green-700/20 text-green-700 border-1 border-green-700">Modifier</button>
                        </> }
                    </div>

                </div>

            </form>

        </SectionBox>
    );
}
