'use client'
import React from 'react'

import { useBedroom } from "../../hooks/useBedroom";
import { room_ctg_list } from "../../configs/types";

import SectionBox, { Title } from "../../components/SectionBox";
import SoldRoom from "../../components/SoldRoom";

export default function SoldedAside() {
    const { bedRoomTab } = useBedroom();

    const roomCategoryAnalysis = React.useMemo(() => {
        return room_ctg_list.map((room_ctg) => {
            const topCtgRooms = bedRoomTab.filter(({ categories }) => (
                categories[0] === room_ctg.id ) );
            return {
                ...room_ctg,
                topSolded: topCtgRooms.filter(room => room.checkIn),
                topTotal: topCtgRooms,
            };
        });
    }, [bedRoomTab]);

    const nbSold = roomCategoryAnalysis.reduce((res, elem) => res + elem.topSolded.length, 0);

    return (
        <SectionBox className="pb-5">

            <Title bar className="mb-2" right={nbSold}>Ventes</Title>

            <div className="flex flex-col gap-3"> { roomCategoryAnalysis.map((room_ctg) => (
                <SoldRoom key={room_ctg.id}
                    name={room_ctg.name}
                    subName={room_ctg.price}
                    sold={room_ctg.topSolded.length}
                    total={room_ctg.topTotal.length}
                /> )) }
            </div>

        </SectionBox>
    );
}
