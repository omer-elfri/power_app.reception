export namespace Status {

    export type Type = {
        label: string,
        color: string,
    };

    export type Id = 'sold' | 'free' | 'clean' | 'restaurant' | 'booked' | 'hs';

    export const datas: {[k in Id]: Type} = {
        sold: {
            label: 'Vendu',
            color: '#074507',
        },
        booked: {
            label: 'Réservée',
            color: '#aa00c4',
        },
        restaurant: {
            label: 'Restaurant',
            color: '#c40000',
        },
        clean: {
            label: 'Néttoyage',
            color: '#28bbff',
        },
        hs: {
            label: 'Hors service',
            color: '#8997aa',
        },
        free: {
            label: 'Disponible',
            color: '#8997aa30',
        },
    } as const;
}

export default Status;
