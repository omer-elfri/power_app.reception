'use client'

import BedRoom from "../../types/bedroom";
import { useDataContext } from "../../hooks";
import { room_ctg_list } from "../../configs/types";

import SectionBox, { Title } from "../../components/SectionBox";
import SoldRoom from "../../components/SoldRoom";

export default function SoldedAside() {
    const { analysis } = useDataContext();

    return (
        <SectionBox className="pb-5">

            <Title bar className="mb-2" right={analysis.solded.length}>Ventes</Title>

            <div className="flex flex-col gap-3"> { room_ctg_list.map((room_ctg) => {
                const room_ctg_id = room_ctg.id as BedRoom.Category.Id;
                const datas = analysis.room_ctgs[room_ctg_id];
                return <SoldRoom key={room_ctg.id}
                    name={room_ctg.name} subName={room_ctg.price}
                    value={datas.topSolded.length} total={datas.topTotal.length}
                /> }) }
            </div>

        </SectionBox>
    );
}
