export const bedRoomIds = [
    "001","002","003","004","005",
    "101","102","103","104","105","106","107","108","109","110","111",
    "201","202","203","204","205","206","207","208","209","210","211",
] as const;

export type BedRoomId = typeof bedRoomIds[number];

export function isBedRoomId(roomId: string | null): roomId is BedRoomId {
    return bedRoomIds.includes(roomId as BedRoomId);
}

export type EspStatus = {
    room_id: BedRoomId,
    power: PowerStatus,
}


export type BedRoomType = {
    id: BedRoomId,
    power: PowerStatus,
}

export type BedRoomMap = { [k in BedRoomId]: BedRoomType }




export const powerStatus = [ "POWER_OK", "POWER_KO", "DISCONNECTED" ] as const;

export type PowerStatus = typeof powerStatus[number];

export function isPowerStatus(power: string): power is PowerStatus {
    return powerStatus.includes(power as PowerStatus);
}



export const floorsTabRoomsIds : {
    floor : string,
    bedrooms : BedRoomId[],
}[] = [
    {
        floor : "Rez de chaussée",
        bedrooms : ["001", "002", "003", "004", "005"],
    }, {
        floor : "Premier étage",
        bedrooms : ["101", "102", "103", "104", "105", "106", "107", "108", "109", "110", "111"],
    }, {
        floor : "Deuxième étage",
        bedrooms : ["201", "202", "203", "204", "205", "206", "207", "208", "209", "210", "211"],
    },
];


export const pageIds = [ "GLOBAL", "ROOMS" ] as const;

export type PageId = typeof pageIds[number];
