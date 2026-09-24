import { uniqueId } from "../tools/tools";
import BedRoom from "../types/bedroom";

export const bedrooms_datas: Data[] = uniqueId([
    {
        'id': '001',
        'category': ["economic", "standard"],
        'stage': 0,
    },
    {
        'id': '002',
        'category': ["economic", "standard"],
        'stage': 0,
    },
    {
        'id': '003',
        'category': ["economic", "standard"],
        'stage': 0,
    },
    {
        'id': '004',
        'category': ["economic", "standard"],
        'stage': 0,
    },
    {
        'id': '005',
        'category': ["economic", "standard"],
        'stage': 0,
    },

    {
        'id': '101',
        'category': ["executive"],
        'stage': 1,
    },
    {
        'id': '102',
        'category': ["executive"],
        'stage': 1,
    },
    {
        'id': '103',
        'category': ["executive"],
        'stage': 1,
    },
    {
        'id': '104',
        'category': ["executive"],
        'stage': 1,
    },
    {
        'id': '105',
        'category': ["mini_suite"],
        'stage': 1,
    },
    {
        'id': '106',
        'category': ["executive_plus"],
        'stage': 1,
    },
    {
        'id': '107',
        'category': ["executive_plus"],
        'stage': 1,
    },
    {
        'id': '108',
        'category': ["suite"],
        'stage': 1,
    },
    {
        'id': '109',
        'category': ["standard"],
        'stage': 1,
    },
    {
        'id': '110',
        'category': ["standard"],
        'stage': 1,
        'price': 10500,
    },
    {
        'id': '111',
        'category': ["executive"],
        'stage': 1,
    },

    {
        'id': '201',
        'category': ["executive"],
        'stage': 2,
    },
    {
        'id': '202',
        'category': ["executive"],
        'stage': 2,
    },
    {
        'id': '203',
        'category': ["executive"],
        'stage': 2,
    },
    {
        'id': '204',
        'category': ["executive"],
        'stage': 2,
    },
    {
        'id': '205',
        'category': ["mini_suite"],
        'stage': 2,
    },
    {
        'id': '206',
        'category': ["executive_plus"],
        'stage': 2,
    },
    {
        'id': '207',
        'category': ["executive_plus"],
        'stage': 2,
    },
    {
        'id': '208',
        'category': ["suite"],
        'stage': 2,
    },
    {
        'id': '209',
        'category': ["standard"],
        'stage': 2,
    },
    {
        'id': '210',
        'category': ["standard"],
        'stage': 2,
    },
    {
        'id': '211',
        'category': ["executive"],
        'stage': 2,
    },
] as const);

export type Data = {
    id: string,
    category: [
        BedRoom.Category.Id,
        ...BedRoom.Category.Id[]
    ],
    stage: 0 | 1 | 2 | 3 | 4 | 5,
    price?: number,
}
