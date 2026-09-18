import React from "react";
import { UpdateBedRoomCallback } from "../../datas/bedroom_context";
import { isBedRoomId, isPowerStatus } from "../../datas/type";

export const webSocket: WebSocket | null = null;
const serverIp = process.env.NEXT_PUBLIC_SERVER_IP!;
const wsPort = process.env.PORT ?? process.env.NEXT_PUBLIC_WEB_SOCKET_PORT ?? "81";
const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL ?? `${serverIp}:${wsPort}`;

export const askConnexion = (
    setServer: React.Dispatch<React.SetStateAction<WebSocket | null>>,
    updateBedRoom: UpdateBedRoomCallback,
) => {
    const socket = new WebSocket(`wss://${serverUrl}/web`);

    socket.onmessage = (event) => {
        const message: string = event.data;
        // console.log("SERVER ...");

        if (message === "CONNECTED") {
            acceptConnection(socket, setServer, updateBedRoom);
        }
    }
}

export const acceptConnection = (
    webSocket: WebSocket,
    setServer: React.Dispatch<React.SetStateAction<WebSocket | null>>,
    updateBedRoom: UpdateBedRoomCallback
) => {
    // console.log("SERVER ✅");
    setServer(webSocket);

    webSocket.onmessage = (event) => {
        const message: string = event.data;

        if (message.startsWith("STATUS:")) {
            const roomStatus = message.slice(7).split(";");

            roomStatus.forEach((roomStat) => {
                const [roomId, power] = roomStat.split('|');
                if (!isBedRoomId(roomId) || !isPowerStatus(power))
                    return;
                updateBedRoom(roomId, { power });
            });

        } else
        if (message.startsWith("CH-")) {

            const [roomId, commande] = message.slice(3).split(":");

            if (!isBedRoomId(roomId))
                return;

            if (isPowerStatus(commande)) {
                updateBedRoom(roomId, { power: commande });
            } else {
                // console.log("SERVER:", message);
            }
        }
    }

    webSocket.onerror = () => {
        // console.log("SERVER ⭕️");
    }

    webSocket.onclose = () => {
        // console.log("SERVER ❌\n\n");
        setServer(null);
        askConnexion(setServer, updateBedRoom);
    }
}
