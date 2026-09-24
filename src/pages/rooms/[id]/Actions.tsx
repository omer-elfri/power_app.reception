import React from "react";
import { useParams } from "react-router-dom";
import { invoke } from "@tauri-apps/api/core";

import BedRoom from "../../../types/bedroom";
import { useDataContext } from "../../../datas/context";
import { GrStatusGoodSmall } from "react-icons/gr";

export default function ActionSide({ }: {
}) {
    const { roomId } = useParams();
    const { bedRooms } = useDataContext();
    if (!BedRoom.is(roomId!)) return;

    const bedRoom = bedRooms[roomId];
    const powerOn = bedRoom.power === "ON";
    const powerOff = bedRoom.power === "OFF";

    const [loading, setLoading] = React.useState(false);

    const switchPower = React.useCallback(async () => {
        setLoading(true);
        await new Promise((resolve) => setTimeout(resolve, 500));
        await invoke("power_control", {
            roomId: bedRoom.id,
            power: {
                "ON" : "POWER_KO",
                "OFF" : "POWER_OK",
                "NONE" : "DISCONNECTED",
            }[bedRoom.power],
        });
        setLoading(false);
    }, [bedRoom, setLoading]);

    return (
        <div className="flex flex-row items-center gap-3 h-25 py-5 px-5 border-t-2 border-gray-400/50 pb-10">

            { (bedRoom.power === "NONE") ? (<>

                <GrStatusGoodSmall className="text-red-500" />
                <p className="font-bold uppercase text-gray-400/80 text-[15px]">Déconnecté</p>

            </>) : (<>

                <button onClick={switchPower} disabled={powerOn || loading}
                    className={ (powerOff && !loading) ? "bg-green-500" : "bg-gray-400" }>
                    Alimenter
                </button>

                <button  onClick={switchPower}disabled={powerOff || loading}
                    className={ (powerOn && !loading) ? "bg-red-400" : "bg-gray-400" }>
                    Éteindre
                </button>

            </>) }

        </div>
    );
}
