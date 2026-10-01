'use client'

import React from "react";
import { twMerge } from "tailwind-merge";

import { useDataContext } from "../../datas/context";
import { employers_datas } from "../../configs/employer";
import BedRoom from "../../types/bedroom";
import Employer from "../../types/employer";
import { formatPrice } from "../../tools";

import SectionBox, { Title } from "../../components/SectionBox";
import { ImCross } from "react-icons/im"
import { GiBroom } from "react-icons/gi";
import { HiLightningBolt } from "react-icons/hi";
import { FaCalendarAlt, FaTools } from "react-icons/fa";
import { MdPerson } from "react-icons/md";

export default function RoomInfos({ room:bedRoom }: {
    room: BedRoom.Type,
}) {
    return (<>
        <CheckIn room={bedRoom} />
        <Cleaning room={bedRoom} />
        <Issues room={bedRoom} />
        <Recents room={bedRoom} />
    </>);
}



function CheckIn({ room:bedRoom }: {
    room: BedRoom.Type,
}) {
    const { analysis, setRoomPopup } = useDataContext();

    return (
        <SectionBox subClassName="gap-4">

            <Title bar right={<ImCross size={13} className="text-red-700 cursor-pointer" onClick={() => setRoomPopup(null)} />} >
                <h1 className="font-bold text-[18px]">CH {bedRoom.id}</h1>
            </Title>

            <form className="flex flex-col gap-y-2 rounded-md" onSubmit={(e) => {
                e.preventDefault();
            }}> {/* check in / check out */}

                <h2 className="font-bold text-[13px]">Informations client</h2>
                <LabelInput label="Nom complet" name="fullname" required defaultVal={bedRoom.check_in?.name} />
                <LabelInput label="Sexe" name="sexe" defaultVal={bedRoom.check_in?.sexe} options={[
                    { k: 'Mr', value: "Homme", },
                    { k: 'Mme', value: "Femme", },
                ]} required />
                <LabelInput label="Adresse électronique" name="mail" defaultVal={bedRoom.check_in?.mail} />
                <LabelInput label="Entreprise" name="enterprise" defaultVal={bedRoom.check_in?.enterprise} />
                <LabelInput label="IFU" name="ifu" defaultVal={bedRoom.check_in?.ifu} />


                <h2 className="font-bold text-[13px] mt-5">Informations chambre</h2>
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
                        <button type='submit' className="col-span-2 flex flex-row justify-center bg-green-700/20 text-green-700">Check in</button>
                    ) : <>
                        <button type='submit' className="flex flex-row justify-center border-1 border-red-700 text-red-700">Check out</button>
                        <button type='submit' className="flex flex-row justify-center bg-yellow-700/20 text-yellow-700 border-yellow-700">Changer de chambre</button>
                        <button type='submit' className="flex flex-row justify-center bg-green-700/20 text-green-700 border-1 border-green-700">Modifier</button>
                    </> }
                </div>

            </form>

        </SectionBox>
    );
}

function Cleaning({ room:bedRoom }: {
    room: BedRoom.Type,
}) {
    return (
        <SectionBox>
            <Title right={<span className="text-gray-500 text-[11px]">fait le 30/09</span>}>Entretien</Title>
            <form className="flex flex-col gap-y-2 rounded-md"> {/* entretien */}

                <h2 className="font-bold text-[13px]">Entretien</h2>
                <LabelInput label="Vallet" name="vallet" options={
                    Object.entries(employers_datas)
                    .filter(([_, employer]) => employer.rules.includes(Employer.Rule.CLEANER))
                    .map(([id, employer]) => ({ k: id, value: employer.name }))
                } required />


                <div className="grid grid-cols-2 gap-2">
                    { !bedRoom.cleaning ? (
                        <button type='submit' className="col-span-2 flex flex-row justify-center uppercase bg-blue-700/20 text-blue-700 mt-2">Néttoyer</button>
                    ) : <>
                        <button type='submit' className="flex flex-row justify-center border-1 border-red-700 text-red-700">Annuler</button>
                        <button type='submit' className="flex flex-row justify-center bg-green-700/20 text-green-700">Fait</button>
                    </> }
                </div>

            </form>
        </SectionBox>
    );
}

function Issues({ room:bedRoom }: {
    room: BedRoom.Type,
}) {
    return (
        <SectionBox>
            <Title>Problèmes</Title>
            <form className="flex flex-col gap-y-2 rounded-md"> {/* entretien */}

                <LabelInput label="Priorité" name="priority" options={[
                    { k: 'low', value: "Faible" },
                    { k: 'medium', value: "Critique" },
                    { k: 'high', value: "Urgent" },
                ]} required />

                <LabelInput label="Message" name="message" required>
                    <textarea className="h-20"></textarea>
                </LabelInput>


                <div className="grid grid-cols-2 gap-2">
                    { !bedRoom.cleaning ? (
                        <button type='submit' className="col-span-2 flex flex-row justify-center uppercase bg-blue-700/20 text-blue-700 mt-2">Soumettre</button>
                    ) : <>
                        <button type='submit' className="flex flex-row justify-center border-1 border-red-700 text-red-700">Retirer</button>
                        <button type='submit' className="flex flex-row justify-center bg-green-700/20 text-green-700">Mettre a jour</button>
                    </> }
                </div>

            </form>
        </SectionBox>
    );
}

function Recents({ room:bedRoom }: {
    room: BedRoom.Type,
}) {
    return (
        <SectionBox>
            <Title>Récents</Title>
            <IssueBox icon={<GiBroom size={25} />} color="#a16207">
                Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quae perspiciatis natus, vitae, doloribus accusamus nam ducimus omnis dolor quasi cum, officiis modi? Expedita rerum dicta veniam reprehenderit, similique quisquam ducimus!
            </IssueBox>
            <IssueBox icon={<HiLightningBolt size={25} />} color="#15803d">
                Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quae perspiciatis natus, vitae, doloribus accusamus nam ducimus omnis dolor quasi cum, officiis modi? Expedita rerum dicta veniam reprehenderit, similique quisquam ducimus!
            </IssueBox>
            <IssueBox icon={<FaCalendarAlt size={18} />} color="#b91c1c">
                Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quae perspiciatis natus, vitae, doloribus accusamus nam ducimus omnis dolor quasi cum, officiis modi? Expedita rerum dicta veniam reprehenderit, similique quisquam ducimus!
            </IssueBox>
            <IssueBox icon={<MdPerson size={22} />} color="#1d4ed8">
                Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quae perspiciatis natus, vitae, doloribus accusamus nam ducimus omnis dolor quasi cum, officiis modi? Expedita rerum dicta veniam reprehenderit, similique quisquam ducimus!
            </IssueBox>
            <IssueBox icon={<FaTools size={18} />} color="#7e22ce">
                Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quae perspiciatis natus, vitae, doloribus accusamus nam ducimus omnis dolor quasi cum, officiis modi? Expedita rerum dicta veniam reprehenderit, similique quisquam ducimus!
            </IssueBox>
        </SectionBox>
    );
}





function LabelInput({ label, type="text", name, options, className, children, required, defaultVal }: {
    label: string,
    name: string,
    options?: { k: string, value: string }[],
    required?: boolean,
    className?: string,
    children?: React.ReactNode,
    type?: string,
    defaultVal?: string,
}) {
    let res: React.ReactNode = children;
    // const value = datas[name];

    if (options) res = (
        <select name={name} className={twMerge("text-[11px] font-bold h-7", className)} defaultValue={defaultVal}>
            { options.map((option) => (
                <option key={option.k} value={option.k}>{option.value}</option>
            )) }
        </select>
    );

    if (!res) res = (
        <input name={name} type={type} className={twMerge("text-[11px] px-3 h-7", className)} defaultValue={defaultVal} />
    );

    return (
        <div className="flex flex-col gap-1">
            <label>
                <span className="text-[11px]">{label} </span>
                { required && <span className="text-red-700">*</span> }
            </label>
            { res }
        </div>
    );
}

function IssueBox({ icon, children, color }: {
    icon: React.ReactNode,
    children: string;
    color: string;
}) {
    return (
        <div className="grid grid-cols-[40px_1fr] gap-3 border-t-1 border-gray-300 py-2">
            <div className="aspect-square rounded-full flex justify-center items-center p-2" style={{ backgroundColor: color+"20", color }}>
                { icon }
            </div>
            <p className="text-[12px] line-clamp-3">{children}</p>
        </div>
    );
}
