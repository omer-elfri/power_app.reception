import React from "react";

import { invoke } from "@tauri-apps/api/core";
import { sendNotification } from "@tauri-apps/plugin-notification";
import { listen } from "@tauri-apps/api/event";

import BedRoom from "./types/bedroom";
import { askPermission } from "./tools/notifications";
import { useDataContext } from "./datas/context";

type EspStatus = {
    room_id: BedRoom.Id,
    power: BedRoom.Power,
}

export default function InitComponent() {
  const { bedRooms, updateBedRoom } = useDataContext();

  React.useEffect(() => { // general_info and notification settings
      askPermission();
      (async () => {
          const espTab = await invoke<EspStatus[]>("general_status");
          espTab.forEach((esp) => updateBedRoom(esp.room_id, esp));
      })();
  }, []);

  React.useEffect(() => { // reponse du serveur
        const unlisten = listen<{
            room_id: BedRoom.Id;
            power: BedRoom.Power;
        }>("power-status", (event) => {
            const { room_id:roomId, power } = event.payload;

            updateBedRoom(roomId, { power });
            sendNotification({
                title: `Chambre ${roomId}`,
                body: {
                    "ON": "Chambre alimentée",
                    "OFF": "Chambre éteinte",
                    "NONE": "Chambre déconnectée"
                }[power],
            });
        });
        return () => {
            unlisten.then((fn) => fn());
        }
  }, []);

  return null;
}
