'use client'

import React from "react";

import { invoke } from "@tauri-apps/api/core";
import { sendNotification, isPermissionGranted, requestPermission } from "@tauri-apps/plugin-notification";
import { listen } from "@tauri-apps/api/event";

import BedRoom from "./types/bedroom";
import { useBedRoom } from './hooks/bedroom';
import { useReservation } from "./hooks/reservation";

export default function InitComponent() {
  const reservations = useReservation();
  const { switch_power, check_in, check_out, clean, updateBedRoom, } = useBedRoom();

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
            espTab.forEach((esp) => updateBedRoom(esp.room_id, esp));
        })();
  }, []);

  React.useEffect(() => {
    reservations.add({ date: new Date(2026, 9, 4), client: "Teazer", rooms: [
        { roomId: '003',
            start: new Date(2026, 9, 5),
            end: new Date(2026, 9, 7),
        },
        { roomId: '203',
            start: new Date(2026, 9, 3),
            end: new Date(2026, 9, 4),
        },
    ], description: "pour Mr Foast" });

    reservations.add({ date: new Date(2026, 9, 6), client: "Teazer 2", rooms: [
        { roomId: '103',
            start: new Date(2026, 9, 7),
            end: new Date(2026, 9, 8),
        },
        { roomId: '104',
            start: new Date(2026, 9, 7),
            end: new Date(2026, 9, 8),
        },
    ], description: "pour Mr Foast" });

    reservations.add({ date: new Date(2026, 9, 5), client: "Teazer 3", rooms: [
        { roomId: '106',
            start: new Date(2026, 9, 5),
            end: new Date(2026, 9, 7),
        },
    ], description: "pour Mr Foast", });

    reservations.cancel(2);

    switch_power('003', true);
    switch_power('101', true);
    switch_power('104', true);
    switch_power('105', true);
    switch_power('108', true);

    check_in('003', { name: "Smith ADJALLALA", price: 10500, });
    check_in('102', { sexe: 'Mr', name: "Smith ADJALLALA", price: 18500, });
    check_in('105', { name: "Fabrice ADJALLALA", price: 32000, });
    check_in('107', { sexe: 'Mme', name: "Flore", price: 25500, });

    clean('104', 'vallet1');
    clean('105', 'vallet2');
    clean('106', 'vallet3');
    // cancel_clean('104');

    updateBedRoom('108', { issue: { priority: "high", message: "we", } });
    updateBedRoom('109', { issue: { priority: "low", message: "fre fenlj", } });
    updateBedRoom('111', { issue: { priority: "medium", message: "fre fre feru", } });
  }, []);

  React.useEffect(() => {
    const id = setTimeout(() => check_out('105'), 5000);
    return () => clearTimeout(id);
  }, []);

  React.useEffect(() => { // reponse du serveur
        const unlisten = listen<{
            room_id: BedRoom.Id;
            power: boolean;
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
