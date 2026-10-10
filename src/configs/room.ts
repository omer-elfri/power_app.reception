import BedRoom from "../types/bedroom";
import { RoomData } from "./types";

export const roomIds = [
    '001', '002', '003', '004', '005',
    '101', '102', '103', '104', '105', '106', '107', '108', '109', '110', '111',
    '201', '202', '203', '204', '205', '206', '207', '208', '209', '210', '211',
] as const;

export const room_datas: {[k in BedRoom.Id]: RoomData} = {
    '001': {
        'categories': ["economic", "standard"],
        'stage': '0',
    },
    '002': {
        'categories': ["economic", "standard"],
        'stage': '0',
    },
    '003': {
        'categories': ["economic", "standard"],
        'stage': '0',
    },
    '004': {
        'categories': ["economic", "standard"],
        'stage': '0',
    },
    '005': {
        'categories': ["economic", "standard"],
        'stage': '0',
    },

    '101': {
        'categories': ["executive"],
        'stage': '1',
    },
    '102': {
        'categories': ["executive"],
        'stage': '1',
    },
    '103': {
        'categories': ["executive"],
        'stage': '1',
    },
    '104': {
        'categories': ["executive"],
        'stage': '1',
    },
    '105': {
        'categories': ["mini_suite"],
        'stage': '1',
    },
    '106': {
        'categories': ["executive_plus"],
        'stage': '1',
    },
    '107': {
        'categories': ["executive_plus"],
        'stage': '1',
    },
    '108': {
        'categories': ["suite"],
        'stage': '1',
    },
    '109': {
        'categories': ["standard"],
        'stage': '1',
    },
    '110': {
        'categories': ["executive"],
        'stage': '1',
    },
    '111': {
        'categories': ["executive"],
        'stage': '1',
    },

    '201': {
        'categories': ["executive"],
        'stage': '2',
    },
    '202': {
        'categories': ["executive"],
        'stage': '2',
    },
    '203': {
        'categories': ["executive"],
        'stage': '2',
    },
    '204': {
        'categories': ["executive"],
        'stage': '2',
    },
    '205': {
        'categories': ["mini_suite"],
        'stage': '2',
    },
    '206': {
        'categories': ["executive_plus"],
        'stage': '2',
    },
    '207': {
        'categories': ["executive_plus"],
        'stage': '2',
    },
    '208': {
        'categories': ["suite"],
        'stage': '2',
    },
    '209': {
        'categories': ["standard"],
        'stage': '2',
    },
    '210': {
        'categories': ["executive"],
        'stage': '2',
    },
    '211': {
        'categories': ["executive"],
        'stage': '2',
    },
}
