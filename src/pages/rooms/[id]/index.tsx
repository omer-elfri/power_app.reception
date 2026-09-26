import { useParams } from "react-router-dom";

import ActionSide from "./Actions";
import PageTitle from "../../../components/PageTitle";
import BedRoom from "../../../types/bedroom";

export default function RoomPage({ }: {
}) {
    const { roomId } = useParams();

    if (!BedRoom.is(roomId!)) return;

    return (
        <div className="flex flex-col gap-10 h-screen">
            <PageTitle />
            <div className="flex-1"> </div>
            <ActionSide />
        </div>
    );
}
