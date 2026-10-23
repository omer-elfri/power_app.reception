'use client'

import React from "react";
import { useBedroom } from '../hooks/useBedroom';

import { invoke } from "@tauri-apps/api/core";
import { sendNotification } from "@tauri-apps/plugin-notification";
import { listen } from "@tauri-apps/api/event";
import BedRoom from "../types/bedroom";

export function useServer() {
    const { switch_power } = useBedroom();

    React.useEffect(() => {
        (async () => {
            const espTab = await invoke<{ room_id: BedRoom.Id, power: boolean, }[]>("general_status");
            espTab.forEach(esp => switch_power(esp.room_id, esp.power));
        })();
    }, []);

    React.useEffect(() => { // reponse du serveur
        const unlisten = listen<{ room_id: BedRoom.Id; power: boolean | null; }>("power-status", (event) => {
            const { room_id:roomId, power } = event.payload;
            switch_power(roomId, power);
            sendNotification({ title: `Chambre ${roomId}`,
                body: power ? "Chambre alimentée" : (power === false) ? "Chambre éteinte" : "Chambre déconnectée",
            });
        });
        return () => { unlisten.then(fn => fn()); }
    }, []);
}

