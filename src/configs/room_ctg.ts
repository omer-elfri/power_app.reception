import BedRoom from "../types/bedroom";

export const room_ctg_list = [
    {
        'id': "economic",
        'name': "Économique",
        'price': 10500,
        'option': "VENT",
    },
    {
        'id': "standard",
        'name': "Standard",
        'price': 12500,
        'option': "CLIM",
    },
    {
        'id': "executive",
        'name': "Exécutive",
        'price': 18500,
        'option': "CLIM",
    },
    {
        'id': "executive_plus",
        'name': "Exécutive Plus",
        'price': 25500,
        'option': "CLIM",
    },
    {
        'id': "mini_suite",
        'name': "Mini Suite",
        'price': 35500,
        'option': "CLIM",
    },
    {
        'id': "suite",
        'name': "Suite 1 Chambre",
        'price': 45500,
        'option': "CLIM",
    },
] as const satisfies RoomCtgData[];

export type RoomCtgData = {
    id: BedRoom.Category.Id,
    name: string,
    price: number,
    option: 'VENT' | 'CLIM',
}

