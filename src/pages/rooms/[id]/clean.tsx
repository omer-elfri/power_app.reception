import { twMerge } from "tailwind-merge";
import { employers_datas } from "../../../configs/employer";
import BedRoom from "../../../types/bedroom";

import SectionBox, { Title } from "../../../components/SectionBox";
import LabelInput from "../../../components/LabelInput";
import Employer from "../../../types/employer";

export default function CleanSection({ room:bedRoom, className }: {
    room: BedRoom.Type,
    className?: string,
}) {
    return (
        <SectionBox className={twMerge("", className)} subClassName="overflow-auto" >
            <Title right={<span className="text-gray-500 text-[11px]">fait le 30/09</span>}>Entretien</Title>
            <form className="flex flex-col gap-y-2 rounded-md"> {/* entretien */}

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
