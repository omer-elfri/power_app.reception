import React from "react";

import { useBedRoom } from "../../../datas/bedroom_context";
import { twMerge } from "tailwind-merge";
import { invoke } from "@tauri-apps/api/core";

export default function BedRoomModal({ }: {
}) {
  const { bedRooms, bedroomModal, setBedroomModal } = useBedRoom();
  const bedRoom = bedRooms[bedroomModal!];

    const switchPower = React.useCallback(async () => {
        const newPower = (
            bedRoom.power === "POWER_OK" ? "POWER_KO" :
            bedRoom.power === "POWER_KO" ? "POWER_OK" :
            "DISCONNECTED"
        );
        // setLoading(true);
        await new Promise((resolve) => setTimeout(resolve, 500));
        await invoke("power_control", {
            roomId: bedRoom.id,
            power: newPower,
        });
    }, [bedRoom, //setLoading
    ]);


  const Case = React.useCallback(({ className, children }: {
    className?: string,
    children?: React.ReactNode,
  }) => {
    return (
        <div className={twMerge("flex flex-col gap-2 bg-blue-300/50 rounded-md p-3", className)}>
          { children }
        </div>
    );
  }, []);

  const powerOn = bedRooms[bedroomModal!].power === "POWER_OK";
  const powerOff = bedRooms[bedroomModal!].power === "POWER_KO";

  return (
    <div className="grid grid-cols-[3fr_4fr_2fr] gap-3 h-30">
        <Case>
          <h1 className="uppercase font-bold text-[13px]">CH {bedRoom.id}</h1>

        </Case>
        <Case />

        <Case className="gap-1">
            <button disabled={powerOn} className={ powerOff ? "bg-green-500" : "bg-gray-400" } onClick={() => { switchPower() }}>Alimenter</button>
            <button disabled={powerOff} className={ powerOn ? "bg-blue-500" : "bg-gray-400" } onClick={() => { switchPower() }}>Éteindre</button>
            <button className="bg-red-500/50" onClick={() => setBedroomModal(null)}>Fermer</button>
        </Case>

    </div>
  );
}
