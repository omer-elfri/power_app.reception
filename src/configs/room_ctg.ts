import { RoomCtgData } from "./types";

export const room_ctg_datas = {
    'economic': {
        'name': "Économique",
        'price': 10500,
        'option': "VENT",
    },
    'standard': {
        'name': "Standard",
        'price': 12500,
        'option': "CLIM",
    },
    'executive': {
        'name': "Exécutive",
        'price': 18500,
        'option': "CLIM",
    },
    'executive_plus': {
        'name': "Exécutive Plus",
        'price': 25500,
        'option': "CLIM",
    },
    'mini_suite': {
        'name': "Mini Suite",
        'price': 35500,
        'option': "CLIM",
    },
    'suite': {
        'name': "Suite 1 Chambre",
        'price': 45500,
        'option': "CLIM",
    },
} as const satisfies Record<string, RoomCtgData>;
