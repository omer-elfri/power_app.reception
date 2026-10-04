'use client'

import React from "react";

import { invoke } from "@tauri-apps/api/core";
import { sendNotification, isPermissionGranted, requestPermission } from "@tauri-apps/plugin-notification";
import { listen } from "@tauri-apps/api/event";

import BedRoom from "./types/bedroom";
import { useDataContext } from './hooks';
import { useReservation } from "./hooks/reservation";

export default function InitComponent() {
  const reservations = useReservation();
  const { bedRooms } = useDataContext();

  React.useEffect(() => { // general_info and notification settings
        (async () => {
            let permission = await isPermissionGranted();
            if (!permission) {
                permission = (await requestPermission()) === "granted";
            }
            const espTab = await invoke<{
                room_id: BedRoom.Id,
                power: BedRoom.Power,
            }[]>("general_status");
            espTab.forEach((esp) => bedRooms[esp.room_id].update(esp));
        })();
  }, []);

  React.useEffect(() => {
    bedRooms['003'].switchPower(true);
    bedRooms['003'].check_in({ name: "Smith ADJALLALA", price: 10500, });

    reservations.add({ client: "Teazer", rooms: [
        { roomId: '003', start: new Date(Date.now()), end: new Date(Date.now()), },
    ], description: "pour Mr Foast" });
    bedRooms['101'].switchPower(true);
    bedRooms['102'].check_in({ sexe: 'Mr', name: "Smith ADJALLALA", price: 18500, });
    bedRooms['104'].switchPower(true);
    bedRooms['104'].clean('vallet1');
    bedRooms['104'].cancel_clean();
    bedRooms['105'].switchPower(false);
    bedRooms['105'].check_in({ name: "Fabrice ADJALLALA", price: 32000, });
    bedRooms['105'].clean('vallet2');
    bedRooms['106'].clean('vallet3');
    bedRooms['107'].check_in({ sexe: 'Mme', name: "Flore", price: 25500, description: "", });
    bedRooms['108'].update({ power: true });
    bedRooms['108'].update({ issue: { priority: "high", message: "we", } });
    bedRooms['109'].update({ issue: { priority: "low", message: "fre fenlj", } });
    bedRooms['111'].update({ issue: { priority: "medium", message: "fre fre feru", } });
  }, []);

  React.useEffect(() => { // reponse du serveur
        const unlisten = listen<{
            room_id: BedRoom.Id;
            power: BedRoom.Power;
        }>("power-status", (event) => {
            const { room_id:roomId, power } = event.payload;
            bedRooms[roomId].switchPower(power);
            sendNotification({
                title: `Chambre ${roomId}`,
                body: (power) ? "Chambre alimentée"
                : (power === false) ? "Chambre éteinte"
                : "Chambre déconnectée",
            });
        });
        return () => { unlisten.then((fn) => fn()); }
  }, []);

  return null;
}
