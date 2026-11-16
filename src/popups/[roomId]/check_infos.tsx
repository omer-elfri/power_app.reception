import { twMerge } from "tailwind-merge";
import { getFrenchDateTime } from "../../tools/date";
import BedRoom from "../../types/bedroom";

import AsideForm from "../../components/FormAside";
import LabelValue from "../../components/LabelValue";
import NoElem from "../../components/NoElem";
import { MdPerson } from "react-icons/md";
import { formatPrice } from "../../tools";
import { FaExchangeAlt } from "react-icons/fa";
import MyButton from "../../components/MyButton";
import { useRequest } from "../../hooks/useRequest";
import { useVisual } from "../../hooks/useVisual";

export default function CheckInfos({ room:bedRoom, className }: {
    room: BedRoom.Type,
    className?: string,
}) {
    const { addPopup } = useVisual();
    const { check_out } = useRequest();
    return (
        <AsideForm icon={<MdPerson className="text-gray-500" />} title="Informations client"
            className={twMerge("", className)} subClassName="gap-3" right={
                <MyButton name='check_out' icon={<FaExchangeAlt />}
                    className="bg-transparent border-1 text-red-700 border-red-700 !py-1 !px-1 !text-[10px]">Check out
                </MyButton>
            } onSubmit={async () => {
                await check_out(bedRoom.id);
                if (!bedRoom.cleaning)
                    addPopup(['VALLET', bedRoom.id]);
            }}>
            <NoElem list={bedRoom.customer ? [1] : []} text="Aucun client">

                <div className="flex flex-col gap-2">
                    <LabelValue label="Arrivée">{bedRoom.customer ? getFrenchDateTime(bedRoom.customer?.created_date) : '...'}</LabelValue>
                    <LabelValue label="Client">{bedRoom.customer?.sexe} {bedRoom.customer?.name}</LabelValue>
                    <LabelValue label="Téléphone">{bedRoom.customer?.tel}</LabelValue>
                    <LabelValue label="Ville">{bedRoom.customer?.town}</LabelValue>
                    <LabelValue label="Prix unitaire">{formatPrice(bedRoom.customer?.price ?? 0)}</LabelValue>
                    <LabelValue label="Informations supplémentaires"
                        className="flex-wrap min-h-10">
                        {bedRoom.customer?.description || '...'}
                    </LabelValue>
                </div>

            </NoElem>
        </AsideForm>
    );
}

