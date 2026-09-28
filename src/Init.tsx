'use client'

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
  const { analysis, updateBedRoom, bedRooms } = useDataContext();

  React.useEffect(() => { // general_info and notification settings
      askPermission();
      (async () => {
          const espTab = await invoke<EspStatus[]>("general_status");
          espTab.forEach((esp) => updateBedRoom(esp.room_id, esp));
      })();
  }, []);

  React.useEffect(() => {
    updateBedRoom('101', { power: 'ON' });
    updateBedRoom('102', { check_in: { } });
    updateBedRoom('103', { status: 'guest' });
    updateBedRoom('104', { power: 'ON', cleaning: { } });
    updateBedRoom('105', { check_in: { }, power: 'OFF', cleaning: { } });
    updateBedRoom('106', { coming: [1,1], cleaning: { } });
    updateBedRoom('107', { check_in: { } });
    updateBedRoom('108', { power: 'ON', check_in: { } });
  }, []);

  React.useEffect(() => {
    console.log("dws", analysis);
  }, [analysis]);

  React.useEffect(() => { // reponse du serveur
        const unlisten = listen<{
            room_id: BedRoom.Id;
            power: BedRoom.Power;
        }>("power-status", (event) => {
            const { room_id:roomId, power } = event.payload;

            updateBedRoom(roomId, { power });
            sendNotification({
                title: `Chambre ${roomId}`,
                body: !power ? "Chambre déconnectée" : {
                    "ON": "Chambre alimentée",
                    "OFF": "Chambre éteinte",
                }[power],
            });
        });
        return () => {
            unlisten.then((fn) => fn());
        }
  }, []);

  return null;
}
