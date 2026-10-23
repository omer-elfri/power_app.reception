import BedRoom from "../types/bedroom";

export const room_list: RoomData[] = [
    {
        'id': '001',
        'name': '001',
        'categories': ['economic', 'standard'],
        'stage': 'Rez de chaussée',
    },
    {
        'id': '002',
        'name': '002',
        'categories': ['economic', 'standard'],
        'stage': 'Rez de chaussée',
    },
    {
        'id': '003',
        'name': '003',
        'categories': ['economic', 'standard'],
        'stage': 'Rez de chaussée',
    },
    {
        'id': '004',
        'name': '004',
        'categories': ['economic', 'standard'],
        'stage': 'Rez de chaussée',
    },
    {
        'id': '005',
        'name': '005',
        'categories': ['economic', 'standard'],
        'stage': 'Rez de chaussée',
    },

    {
        'id': '101',
        'name': '101',
        'categories': ['executive'],
        'stage': 'Étage 1',
    },
    {
        'id': '102',
        'name': '102',
        'categories': ['executive'],
        'stage': 'Étage 1',
    },
    {
        'id': '103',
        'name': '103',
        'categories': ['executive'],
        'stage': 'Étage 1',
    },
    {
        'id': '104',
        'name': '104',
        'categories': ['executive'],
        'stage': 'Étage 1',
    },
    {
        'id': '105',
        'name': '105',
        'categories': ['mini_suite'],
        'stage': 'Étage 1',
    },
    {
        'id': '106',
        'name': '106',
        'categories': ['executive_plus'],
        'stage': 'Étage 1',
    },
    {
        'id': '107',
        'name': '107',
        'categories': ['executive_plus'],
        'stage': 'Étage 1',
    },
    {
        'id': '108',
        'name': '108',
        'categories': ['suite'],
        'stage': 'Étage 1',
    },
    {
        'id': '109',
        'name': '109',
        'categories': ['standard'],
        'stage': 'Étage 1',
    },
    {
        'id': '110',
        'name': '110',
        'categories': ['executive'],
        'stage': 'Étage 1',
    },
    {
        'id': '111',
        'name': '111',
        'categories': ['executive'],
        'stage': 'Étage 1',
    },

    {
        'id': '201',
        'name': '201',
        'categories': ['executive'],
        'stage': 'Étage 2',
    },
    {
        'id': '202',
        'name': '202',
        'categories': ['executive'],
        'stage': 'Étage 2',
    },
    {
        'id': '203',
        'name': '203',
        'categories': ['executive'],
        'stage': 'Étage 2',
    },
    {
        'id': '204',
        'name': '204',
        'categories': ['executive'],
        'stage': 'Étage 2',
    },
    {
        'id': '205',
        'name': '205',
        'categories': ['mini_suite'],
        'stage': 'Étage 2',
    },
    {
        'id': '206',
        'name': '206',
        'categories': ['executive_plus'],
        'stage': 'Étage 2',
    },
    {
        'id': '207',
        'name': '207',
        'categories': ['executive_plus'],
        'stage': 'Étage 2',
    },
    {
        'id': '208',
        'name': '208',
        'categories': ['suite'],
        'stage': 'Étage 2',
    },
    {
        'id': '209',
        'name': '209',
        'categories': ['standard'],
        'stage': 'Étage 2',
    },
    {
        'id': '210',
        'name': '210',
        'categories': ['executive'],
        'stage': 'Étage 2',
    },
    {
        'id': '211',
        'name': '211',
        'categories': ['executive'],
        'stage': 'Étage 2',
    },
]

export type RoomData = {
    id: BedRoom.Id,
    name: string,
    readonly categories: [
        BedRoom.Category.Id,
        ...BedRoom.Category.Id[],
    ],
    stage: BedRoom.StageId,
    issue?: BedRoom.IssueType | null,
}
