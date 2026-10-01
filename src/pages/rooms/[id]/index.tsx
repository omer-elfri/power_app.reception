'use client'

import { useParams } from "react-router-dom";
import BedRoom from "../../../types/bedroom";
import { useDataContext } from "../../../datas/context";

import PageTitle from "../../../components/PageTitle";

import ClientSection from "./client";
import RecentSection from "./recents";
import IssueSection from "./issues";
import CleanSection from "./clean";
import InfosSection from "./infos";
import ValletSection from "./vallets";

export default function RoomPage() {
    const { id: bedRoomId } = useParams();
    const { bedRooms } = useDataContext();
    const bedRoom = bedRooms[bedRoomId as BedRoom.Id];

    return (
        <div className="flex flex-col min-h-screen gap-5 pb-10">

            <PageTitle />

                {/* <SectionBox className="min-h-50 mt-10">

                </SectionBox> */}

            <div className="grid grid-cols-[3fr_4fr_3fr] gap-5 flex-1">

                <div className="flex flex-col gap-5">
                    <ClientSection room={bedRoom} className="flex-1" />
                    <IssueSection room={bedRoom} />
                </div>

                <div className="flex flex-col gap-5">
                    <InfosSection room={bedRoom} className="flex-1" />
                    <RecentSection room={bedRoom} className="max-h-50" />
                </div>

                <div className="flex flex-col gap-5">
                    <CleanSection room={bedRoom} />
                    <ValletSection room={bedRoom} className="flex-1" />
                </div>

            </div>

        </div>
    );
}
