import { useNavigate, useParams } from "react-router-dom";

import ActionSide from "./Actions";
import PageTitle from "../../../components/PageTitle";
import BedRoom from "../../../types/bedroom";

export default function RoomPage({ }: {
}) {
    const navigate = useNavigate();
    const { roomId } = useParams();
    if (!BedRoom.is(roomId!)) return;

    return (
        <div className="flex flex-col gap-10 h-screen">

            <PageTitle name={`Chambre ${roomId}`}>
                <button
                    className="bg-red-500 hover:bg-red-700 text-white"
                    onClick={() => navigate(-1)}>Retour
                </button>
            </PageTitle>

            <div className="flex-1">

            </div>

            <ActionSide />

        </div>
    );
}
