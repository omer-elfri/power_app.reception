'use client'

import React from "react";

import { invoke } from "@tauri-apps/api/core";
import { sendNotification, isPermissionGranted, requestPermission } from "@tauri-apps/plugin-notification";
import { listen } from "@tauri-apps/api/event";

import BedRoom from "./types/bedroom";
import { useBedroom } from './hooks/useBedroom';

export default function InitComponent() {
    const { switch_power, } = useBedroom();

    React.useEffect(() => { // general_info and notification settings
        (async () => {
            let permission = await isPermissionGranted();
            if (!permission) {
                permission = (await requestPermission()) === "granted";
            }
            const espTab = await invoke<{
                room_id: BedRoom.Id,
                power: boolean,
            }[]>("general_status");
            espTab.forEach((esp) => switch_power(esp.room_id, esp.power));
        })();
    }, []);

    React.useEffect(() => { // reponse du serveur
        const unlisten = listen<{
            room_id: BedRoom.Id;
            power: boolean | null;
        }>("power-status", (event) => {
            const { room_id:roomId, power } = event.payload;
            switch_power(roomId, power);
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
