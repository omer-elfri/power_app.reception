import { RoomData } from "../datas/types";

export const room_datas = {
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
        'price': 10500,
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
} as const satisfies Record<string, RoomData>;
