'use client'

import { twMerge } from "tailwind-merge";
import BedRoom from "../../../types/bedroom";

import SectionBox, { Title } from "../../../components/SectionBox";
import { ImCross } from "react-icons/im";
import { FaCheck } from "react-icons/fa";
import { useDataContext } from "../../../datas/context";
import LabelInput from "../../../components/LabelInput";
import { formatPrice } from "../../../tools";

export default function ClientSection({ room:bedRoom, className }: {
    room: BedRoom.Type,
    className?: string,
}) {
    const { analysis } = useDataContext();

    return (
        <SectionBox className={twMerge("", className)} subClassName="overflow-auto">
            <Title bar>Check in / Check out</Title>

            <form className="grid grid-cols-2 gap-x-2 gap-y-2 rounded-md" onSubmit={(e) => {
                e.preventDefault();
            }}> {/* check in / check out */}

                <div className="bg-rd-400">
                    <h2 className="font-bold text-[13px]">Informations client</h2>
                    <LabelInput label="Nom complet" name="fullname" required defaultVal={bedRoom.check_in?.name} />
                    <LabelInput label="Sexe" name="sexe" defaultVal={bedRoom.check_in?.sexe} options={[
                        { k: 'Mr', value: "Homme", },
                        { k: 'Mme', value: "Femme", },
                    ]} required />
                    <LabelInput label="Adresse électronique" name="mail" defaultVal={bedRoom.check_in?.mail} />
                    <LabelInput label="Entreprise" name="enterprise" defaultVal={bedRoom.check_in?.enterprise} />
                    <LabelInput label="IFU" name="ifu" defaultVal={bedRoom.check_in?.ifu} />

                </div>

                <div className="bg-ble-400">

                    <h2 className="font-bold text-[13px]">Informations chambre</h2>
                    <LabelInput label="Option" name="option" defaultVal={bedRoom.check_in?.option} options={[
                        { k: 'vent', value: "Ventillé", },
                        { k: 'clim', value: "Climatisée", },
                    ]} required />
                    <LabelInput label="Nuitée" name="nuitee" type="number" defaultVal={bedRoom.check_in?.nuitee} required />



                    <h2 className="font-bold text-[13px] mt-5">Paiement</h2>
                    <LabelInput label="Prix unitaire" name="price" type="number" required defaultVal={bedRoom.check_in?.price.toString()} />
                    <LabelInput label="Sous couvert" name="sc" defaultVal={bedRoom.check_in?.sc} options={[
                        { k: 'no', value: "Aucun" },
                        { k: 'mum', value: "SC Maman" },
                        ...analysis.solded.map((room) => ({ k: room.id, value: `${room.id} - ${room.check_in!.name}` }))
                    ]} required />
                    <hr className="my-3 text-gray-400" />


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
