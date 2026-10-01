import BedRoom from "../../../types/bedroom";
import SectionBox, { Title } from "../../../components/SectionBox";
import { twMerge } from "tailwind-merge";
import LabelInput from "../../../components/LabelInput";

export default function IssueSection({ room:bedRoom, className }: {
    room: BedRoom.Type,
    className?: string,
}) {
    return (
        <SectionBox className={twMerge("", className)} subClassName="overflow-auto" >
            <Title bar>Problèmes</Title>
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
