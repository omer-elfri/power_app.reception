'use client'

import React from "react";
import { twMerge } from "tailwind-merge";

import { room_ctg_datas } from "../../configs/room_ctg";
import { FormType, StageId, stages, StatusId } from "../../types";
import BedRoom from "../../types/bedroom";
import { useDataContext } from "../../datas/context";
import { room_ctg_list, room_list } from "../../datas/types";

import SectionBox, { SeeMore, Title } from "../../components/SectionBox";
import { GiHamburgerMenu } from "react-icons/gi";
import { FiGrid } from "react-icons/fi";

export default function FilterSection({ form, setForm, datas, setDatas, className }: {
    form: FormType,
    setForm: React.Dispatch<React.SetStateAction<FormType>>,
    datas: BedRoom.Type[],
    setDatas: React.Dispatch<React.SetStateAction<BedRoom.Type[]>>,
    className?: string,
}) {
    const { analysis } = useDataContext();
    const [search, setSearch] = React.useState("");
    const [stage, setStage] = React.useState<StageId | 'all'>('all');
    const [category, setCategory] = React.useState<BedRoom.Category.Id | 'all'>('all');
    const [status, setStatus] = React.useState<StatusId | 'all'>('all');

    const floorList: StageId[] = React.useMemo(() => {
        const floorTab = room_list
           .map((room) => (room.stage))
           .sort((stageA, stageB) => (
                parseInt(stageA) - parseInt(stageB)));
        return [...new Set(floorTab)];
    }, [room_list]);

    React.useEffect(() => {
        const res = datas
            .filter((room) => { // search
                const categoryNames = room.categories
                    .map(ctgId => room_ctg_datas[ctgId].name);
                const textToSearch = room.id + " " +
                    (room.check_in?.name ?? "") + " " +
                    categoryNames.join(" ");
                const textToSearchFormated = textToSearch.toLowerCase()
                    .normalize("NFD").replace(/[\u0300-\u036f]/g, "");
                const searchFormated = search.toLowerCase()
                    .normalize("NFD").replace(/[\u0300-\u036f]/g, "");
                return textToSearchFormated.includes(searchFormated);
            })
            .filter((room) => { // stage
                if (stage === 'all') return room;
                return (room.stage === stage);
            })
            .filter((room) => { // category
                if (category === 'all') return room;
                return ( room.categories.includes(category) );
            })
            .filter((room) => { // status
                if (status === 'powered') return analysis.powered.some((rm) => (rm.id === room.id));
                if (status === 'sold') return analysis.solded.some((rm) => (rm.id === room.id));
                if (status === 'free') return analysis.free.some((rm) => (rm.id === room.id));
                if (status === 'cleaning') return analysis.cleaning.total.some((rm) => (rm.id === room.id));
                if (status === 'coming') return analysis.coming.some((rm) => (rm.id === room.id));
                if (status === 'issue') return analysis.issues.some((rm) => (rm.id === room.id));
                return room;
            });
        setDatas(res);
    }, [ analysis, datas, setDatas,
        search, stage, category, status
    ]);

    const restoreFilter = React.useCallback(() => {
        setSearch("");
        setStage('all');
        setCategory('all');
        setStatus('all');
    }, []);

    return (
        <SectionBox bottom={<SeeMore onClick={restoreFilter} value="Réinitialiser" />}>

            <Title name="Filtres" className="mb-2" notif={ <div className="flex flex-row gap-x-1">
                <button className={twMerge("", (form==="line")?"text-white bg-green-600":"bg-gray-300/50")}
                    onClick={() => setForm('line')}> <GiHamburgerMenu /> </button>
                <button className={twMerge("", (form==="grid")?"text-white bg-blue-600":"bg-gray-300/50")}
                    onClick={() => setForm('grid')}> <FiGrid /> </button>
            </div> } />

            <div className={twMerge("flex flex-col gap-3", className)}>

                <input type="search" placeholder="Rechercher" value={search} onChange={e => setSearch(e.target.value)}
                    className="flex-1 border-1 text-[11px] font-bold flex-1 rounded py-1 px-3"
                /> 

                <select name="stage" value={stage} onChange={e => {
                    setStage(e.target.value as StageId);
                }} className="border-1 text-[11px] font-bold py-2 h-7">
                    <option value="all">Tous les étages</option>
                    { floorList.map((stageId) => (
                        <option key={stageId} value={stageId}>
                            { stages[stageId as StageId].name }
                        </option>
                    )) }
                </select>

                <select name="category" value={category} onChange={e => {
                    setCategory(e.target.value as BedRoom.Category.Id);
                }} className="border-1 text-[11px] font-bold py-2 h-7">
                    <option value="all">Tous les catégories</option>
                    { room_ctg_list.map((roomCtg) => (
                        <option key={roomCtg.id} value={roomCtg.id}>{roomCtg.name}</option>
                    )) }
                </select>

                <select name="status" value={status} onChange={e => {
                    setStatus(e.target.value as StatusId);
                }} className="border-1 text-[11px] font-bold py-2 h-7">
                    <option value="all">Tous les états</option>
                    <option value="powered">Alimentée</option>
                    <option value="sold">Vendues</option>
                    <option value="free">Disponibles</option>
                    <option value="cleaning">En néttoyage</option>
                    <option value="coming">Réservées</option>
                    <option value="issue">Problèmes</option>
                </select>

            </div>

        </SectionBox>
    );
}
