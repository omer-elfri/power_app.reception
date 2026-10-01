'use client'

import React from "react";

import { invoke } from "@tauri-apps/api/core";
import { sendNotification, isPermissionGranted, requestPermission } from "@tauri-apps/plugin-notification";
import { listen } from "@tauri-apps/api/event";

import { EspStatus, Power } from "./types";
import BedRoom from "./types/bedroom";
import { useDataContext } from "./datas/context";


export default function InitComponent() {
  const { updateBedRoom } = useDataContext();

  React.useEffect(() => { // general_info and notification settings
        (async () => {
            let permission = await isPermissionGranted();
            if (!permission) {
                permission = (await requestPermission()) === "granted";
            }
            const espTab = await invoke<EspStatus[]>("general_status");
            espTab.forEach((esp) => updateBedRoom(esp.room_id, esp));
        })();
  }, []);

  React.useEffect(() => {
    updateBedRoom('003', { power: true, check_in: { name: "Mr Smith ADJALLALA", sexe: 'Mr', price: 10000 } });
    updateBedRoom('101', { power: true });
    updateBedRoom('102', { check_in: { name: "Mr Smith ADJALLALA", sexe: 'Mr', price: 10000 } });
    updateBedRoom('103', { coming: { client: "Mr Teazer", name: "Foast", id: '003', start: new Date(Date.now()),nuitee: 3, } });
    updateBedRoom('104', { power: true, cleaning: 'vallet1'});
    updateBedRoom('105', { power: false, check_in: { name: "Fabrice ADJALLALA", price: 10000 }, cleaning: 'vallet1' });
    updateBedRoom('106', { cleaning: 'vallet3' });
    updateBedRoom('107', { check_in: { name: "Mrs Flore", sexe: 'Mme', price: 10000 } });
    updateBedRoom('108', { power: true });
    updateBedRoom('108', { issues: [{ priority: "high", message: "we", }] });
    updateBedRoom('109', { issues: [{ priority: "low", message: "fre fenlj", }] });
    updateBedRoom('111', { issues: [{ priority: "medium", message: "fre fre feru", }] });
  }, []);

  React.useEffect(() => { // reponse du serveur
        const unlisten = listen<{
            room_id: BedRoom.Id;
            power: Power;
        }>("power-status", (event) => {
            const { room_id:roomId, power } = event.payload;

            updateBedRoom(roomId, { power });
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
