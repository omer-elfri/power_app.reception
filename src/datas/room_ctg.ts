import { uniqueId } from "../tools/tools";

export const bedroom_ctgs_datas: Data[] = uniqueId([
    {
        'id': 'economic',
        'name': "Chambre Économique",
        'price': 10500,
        'option': "VENT",
    },
    {
        'id': 'standard',
        'name': "Chambre Standard",
        'price': 12500,
        'option': "CLIM",
    },
    {
        'id': 'executive',
        'name': "Chambre Exécutive",
        'price': 18500,
        'option': "CLIM",
    },
    {
        'id': 'executive_plus',
        'name': "Chambre Exécutive Plus",
        'price': 25500,
        'option': "CLIM",
    },
    {
        'id': 'mini_suite',
        'name': "Mini Suite",
        'price': 35500,
        'option': "CLIM",
    },
    {
        'id': 'suite',
        'name': "Suite 1 Chambre",
        'price': 45500,
        'option': "CLIM",
    },
] as const);

export type Data = {
    id: string,
    name: string,
    price: number,
    option: 'VENT' | 'CLIM',
}
