'use client'

import React from "react";
import { twMerge } from "tailwind-merge";

import { useDataContext } from "../../hooks";
import { colors, State, StatusId } from "../../types";
import BedRoom from "../../types/bedroom";

import SectionBox, { SeeMore, Title } from "../../components/SectionBox";
import { GiBroom, GiHamburgerMenu } from "react-icons/gi";
import { FaCalendarAlt, FaTools } from "react-icons/fa";
import { HiLightningBolt } from "react-icons/hi";
import { MdPerson } from "react-icons/md";
import { IoBed } from "react-icons/io5";
import { FiGrid } from "react-icons/fi";
import { FormType } from ".";

export default function FilterSection({ form, setForm, datas, setDatas, className }: {
    form: FormType,
    setForm: State<FormType>,
    datas: BedRoom.Type[],
    setDatas: State<BedRoom.Type[]>,
    className?: string,
}) {
    const { bedroom_table, bedroom_ctg_table } = useDataContext();
    const [status, setStatus] = React.useState<StatusId[]>([]);
    const [search, setSearch] = React.useState("");
    const [stage, setStage] = React.useState<BedRoom.StageId | 'all'>('all');
    const [category, setCategory] = React.useState<BedRoom.Category.Id | 'all'>('all');

    const floorList: BedRoom.StageId[] = React.useMemo(() => {
        const floorTab = bedroom_table.list.map(room => room.stage)
           .sort((stageA, stageB) => parseInt(stageA) - parseInt(stageB));
        return [...new Set(floorTab)];
    }, [bedroom_table]);

    React.useEffect(() => {
        const res = datas
            .filter((room) => { // search
                const categoryNames = room.categories
                    .map(ctgId =>  bedroom_ctg_table.getId(ctgId)?.name ?? "" );
                const textToSearch = room.id + " " +
                    (room.customer?.name ?? "") + " " +
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
                if (status.includes('powered') && !room.power
                    || status.includes('sold') && !room.customer
                    || status.includes('free') && room.customer
                    || status.includes('cleaning') && !room.cleaner
                    || status.includes('coming') && !room.booked
                    || status.includes('issue') && !room.issue)
                    return false;
                return true;
            });
        setDatas(res);
    }, [ datas, setDatas,
        search, stage, category, status
    ]);

    const restoreFilter = React.useCallback(() => {
        setSearch("");
        setStage('all');
        setCategory('all');
        setStatus([]);
    }, []);

    const FilterOption = React.useCallback(({ value, children, color, title }: {
        value: StatusId,
        children: React.ReactNode,
        color: string,
        title?: string,
    }) => {
        const switchFilter = () => {
            setStatus((status) => {
                let res = status.includes(value)
                    ? status.filter(stat => stat !== value)
                    : [...status, value];
                if (value === 'sold') res = res
                    .filter(stat => stat !== 'free');
                if (value === 'free') res = res
                    .filter(stat => stat !== 'sold');
                return res;
            });
        }
        return (
            <div title={title} className="flex justify-center items-center aspect-square p-3 rounded \
                bg-gray-400/10 text-gray-600 cursor-pointer" onClick={switchFilter}
                style={status.includes(value) ? { backgroundColor: color+"20", color } : {}}>
                { children }
            </div>
        );
    }, [status, setStatus]);

    return (
        <SectionBox className={twMerge("", className)} bottom={<SeeMore onClick={restoreFilter} value="Réinitialiser" />}>

            <Title className="mb-2" right={ <div className="flex flex-row gap-x-1">
                <button className={twMerge("", (form==="line")?"text-white bg-green-600":"bg-gray-300/50")}
                    onClick={() => setForm('line')}> <GiHamburgerMenu /> </button>
                <button className={twMerge("", (form==="grid")?"text-white bg-blue-600":"bg-gray-300/50")}
                    onClick={() => setForm('grid')}> <FiGrid /> </button>
            </div> }>Filtres</Title>

            <div className="flex flex-col gap-3">

                <input type="search" placeholder="Rechercher" value={search} onChange={e => setSearch(e.target.value)}
                    className="flex-1 border-1 text-[11px] font-bold flex-1 rounded py-1 px-3"
                /> 

                <select name="stage" value={stage} onChange={e => {
                    setStage(e.target.value as BedRoom.StageId);
                }} className="border-1 !border-gray-600 text-gray-600 text-[11px] font-bold py-2 h-7">
                    <option value="all">Tous les étages</option>
                    { floorList.map((stageId) => (
                        <option key={stageId} value={stageId}> { stageId } </option>
                    )) }
                </select>

                <select name="category" value={category} onChange={e => {
                    setCategory(e.target.value as BedRoom.Category.Id | 'all');
                }} className="border-1 !border-gray-600 text-gray-600 text-[11px] font-bold py-2 h-7">
                    <option value="all">Tous les catégories</option>
                    { bedroom_ctg_table.list.map((roomCtg) => (
                        <option key={roomCtg.id} value={roomCtg.id}>{roomCtg.name}</option>
                    )) }
                </select>

                <div className="flex flex-row flex-wrap gap-1">
                    <FilterOption value='powered' color={colors.powered} title="Alimentées"> <HiLightningBolt size={14} /> </FilterOption>
                    <FilterOption value='sold' color={colors.sold} title="Vendues"> <MdPerson size={16} /> </FilterOption>
                    <FilterOption value='free' color={colors.free} title="Libre"> <IoBed size={14} /> </FilterOption>
                    <FilterOption value='cleaning' color={colors.cleaning} title="En néttoyage"> <GiBroom size={14} /> </FilterOption>
                    <FilterOption value='coming' color={colors.coming} title="Réservées"> <FaCalendarAlt size={14} /> </FilterOption>
                    <FilterOption value='issue' color={'#000'} title="Problème"> <FaTools size={14} /> </FilterOption>
                </div>

            </div>

        </SectionBox>
    );
}
