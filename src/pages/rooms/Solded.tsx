'use client'

import { twMerge } from "tailwind-merge";
import SectionBox, { Title } from "../../components/SectionBox";
import SoldRoom from "../../components/SoldRoom";
import { useRequest } from "../../hooks/useRequest";
import { formatPrice } from '../../tools';

export default function SoldedAside({ className }: {
    className?: string,
}) {
    const { analysis } = useRequest();

    const nbSold = analysis.categories.reduce((res, elem) => res + elem.topSolded.length, 0);

    return (
        <SectionBox className={twMerge("pb-5", className)}>

            <Title bar className="mb-2" right={nbSold}>Ventes</Title>

            <div className="flex flex-col gap-3"> { analysis.categories.map((room_ctg) => (
                <SoldRoom key={room_ctg.name}
                    name={room_ctg.name}
                    subName={formatPrice(room_ctg.price)}
                    sold={room_ctg.topSolded.length}
                    total={room_ctg.topTotal.length}
                /> )) }
            </div>

        </SectionBox>
    );
}
