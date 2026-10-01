import { twMerge } from "tailwind-merge";
import BedRoom from "../../../types/bedroom";
import SectionBox, { Title } from "../../../components/SectionBox";
import RecentInfo from "../../../components/RecentInfo";

import { GiBroom } from "react-icons/gi";
import { HiLightningBolt } from "react-icons/hi";
import { FaCalendarAlt, FaTools } from "react-icons/fa";
import { MdPerson } from "react-icons/md";

export default function ValletSection({ room:bedRoom, className }: {
    room: BedRoom.Type,
    className?: string,
}) {
    return (
        <SectionBox className={twMerge("", className)} subClassName="overflow-auto" >
            <Title>Tableau des vallets</Title>
            <RecentInfo icon={<GiBroom size={20} />} color="#a16207">
                Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quae perspiciatis natus, vitae, doloribus accusamus nam ducimus omnis dolor quasi cum, officiis modi? Expedita rerum dicta veniam reprehenderit, similique quisquam ducimus!
            </RecentInfo>
            <RecentInfo icon={<HiLightningBolt size={20} />} color="#15803d">
                Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quae perspiciatis natus, vitae, doloribus accusamus nam ducimus omnis dolor quasi cum, officiis modi? Expedita rerum dicta veniam reprehenderit, similique quisquam ducimus!
            </RecentInfo>
            <RecentInfo icon={<FaCalendarAlt size={16} />} color="#b91c1c">
                Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quae perspiciatis natus, vitae, doloribus accusamus nam ducimus omnis dolor quasi cum, officiis modi? Expedita rerum dicta veniam reprehenderit, similique quisquam ducimus!
            </RecentInfo>
            {/* <RecentInfo icon={<MdPerson size={22} />} color="#1d4ed8">
                Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quae perspiciatis natus, vitae, doloribus accusamus nam ducimus omnis dolor quasi cum, officiis modi? Expedita rerum dicta veniam reprehenderit, similique quisquam ducimus!
            </RecentInfo>
            <RecentInfo icon={<FaTools size={18} />} color="#7e22ce">
                Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quae perspiciatis natus, vitae, doloribus accusamus nam ducimus omnis dolor quasi cum, officiis modi? Expedita rerum dicta veniam reprehenderit, similique quisquam ducimus!
            </RecentInfo> */}
        </SectionBox>
    );
}
