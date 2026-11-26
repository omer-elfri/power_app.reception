'use client';

import React from "react";
import { useAuth } from "./useAuth";
import { LocalBook, TypeWithTrace, useLocalData } from "./useBook";
import { Config, ConfigType, useConfig } from "./useConfig";

import { CleanType, CustomerType, ReservationType, RestaurantType } from "../types/types";
import BedRoom from "../types/bedroom";
import { supabase } from "../tools/supabase";
import { sendNotification } from "@tauri-apps/plugin-notification";

type DataContextType = {
    bedroom_table: Config<BedRoom.Type>,
    bedroom_categories: ConfigType<BedRoom.Category.Type>[],

    cleaning_book: LocalBook<CleanType>,
    customer_book: LocalBook<CustomerType>,
    reservation_book: LocalBook<ReservationType>,
    restaurant_book: LocalBook<RestaurantType>,
};

export function DataProvider({ children }: {
    children: React.ReactNode,
}) {
    const { employer_table, logged } = useAuth();

    const bedroom_table = useConfig<BedRoom.Type>('bedroom_table', {
        filter: table => table.select(`*,
            category:bedroom_ctg_table(*),
            lastClean:last_clean(*,valet:cleaning_valet(*))`)
            .is('disabled', false),
        listenTables: [ 'bedroom_ctg_table', 'employer_table', 'cleaning_book' ],
    });

    const bedroom_categories = React.useMemo(() => {
        return Array.from( new Map( bedroom_table.list
            .map(room => [ room.category_id, room.category ])
        ).values() ).sort((a, b) => a.price - b.price);
    }, [bedroom_table.list]);


    const cleaning_book = useLocalData<CleanType>('cleaning_book', {
        filter: table => table.select(`*,valet:cleaning_valet(*)`),
        listenTables: [ 'employer_table' ],
        onChange: payload => {
            const oldLine = payload.old as TypeWithTrace<CleanType>;
            const newLine = payload.new as TypeWithTrace<CleanType>;
            const valet = employer_table.getId(newLine.id);
            switch (payload.eventType) {
                case 'INSERT':
                    sendNotification({ title: `Entretien CH ${newLine.room_id}`,
                        body: `Attribué à ${valet ? valet.sexe+" "+valet?.name : "..."}.`, });
                    break;
                case 'UPDATE':
                    if (newLine.done) {
                        sendNotification({ title: `Entretien ${oldLine.room_id} terminé`,
                            body: `L'entretien est terminée par ${valet ? `${valet.sexe} ${valet.name}` : '...'}.`, });
                    } else if (newLine.cancel_date) {
                        sendNotification({ title: `Entretien ${oldLine.room_id} annulé`,
                            body: `L'entretien est annulé.`, });
                    } else {
                        sendNotification({ title: "Entretien ${oldLine.room_id} modifié",
                            body: `L'entretien à été modifiée.`, });
                    }
                    break;
                case 'DELETE':
                    sendNotification({ title: "Entretien ${oldLine.room_id} supprimé",
                        body: `L'entretien de la chambre à été définitivement supprimé.`, });
                    break;
            }
        },
    });

    const customer_book = useLocalData<CustomerType>('customer_book', {
        filter: table => {
            const start = new Date(); start.setHours(0, 0, 0, 0);
            const end = new Date(start); end.setDate(end.getDate() + 1);
            return table.select('*').or(`end.is.null,and(end.gte.${start.toISOString()},end.lt.${end.toISOString()})`);
        }
    });

    const reservation_book = useLocalData<ReservationType>('reservation_book', {
        filter: table => {
            const start = new Date(); start.setHours(0, 0, 0, 0);
            return table.select('*').or(`end_date.gte.${start.toISOString()}`);
        }
    });

    const restaurant_book = useLocalData<RestaurantType>('restaurant_book', {
        filter: () => supabase.rpc('get_active_restaurants'),
        listenTables: [ 'customer_book' ],
        onChange: payload => {
            const oldLine = payload.old as TypeWithTrace<RestaurantType>;
            const newLine = payload.new as TypeWithTrace<RestaurantType>;
            switch (payload.eventType) {
                case 'INSERT':
                    sendNotification({ title: `Nouvelle restauration CH ${newLine.room_id}`,
                        body: `Commande de << ${newLine.article} >>.`, });
                    break;
                case 'UPDATE':
                    if (newLine.paid) {
                        sendNotification({ title: `Restauration ${newLine.id} CH ${newLine.room_id} soldée`,
                            body: `La commande << ${newLine.article} >> de la chambre ${newLine.room_id} à été soldée.`, });
                    } else if (newLine.cancel_date) {
                        sendNotification({ title: `Restauration ${newLine.id} CH ${newLine.room_id} annulée`,
                            body: `La commande << ${oldLine.article} >> de la chambre ${oldLine.room_id} à été annulée.`, });
                    } else {
                        sendNotification({ title: `Restauration ${newLine.id} CH ${newLine.room_id} modifiée`,
                            body: `La commande << ${oldLine.article} >> de la chambre ${oldLine.room_id} à été modifiée.`, });
                    }
                    break;
                case 'DELETE':
                    sendNotification({ title: "Restauration supprimée",
                        body: `La commande << ${oldLine.article} >> de la chambre ${oldLine.room_id} à été définitivement supprimée.`, });
                    break;
            }
        },
    });


    React.useEffect(() => { // get employer_table when bot connected
        employer_table.read();
    }, []);

    React.useEffect(() => { // get books if authentificated
        if (logged) {
            bedroom_table.read();
            cleaning_book.read();
            customer_book.read();
            reservation_book.read();
            restaurant_book.read();
        }
    }, [logged]);


    return (
        <dataContext.Provider value={{
            bedroom_table,
            bedroom_categories,

            cleaning_book,
            customer_book,
            restaurant_book,
            reservation_book,
        }}>
            { children }
        </dataContext.Provider>
    );
}


const dataContext = React.createContext<DataContextType | null>(null);

export function useDataContext() {
    const context = React.useContext(dataContext);
    if (!context)
        throw new Error("useContext doit être utilisé dans ContextProvider");
    return context;
}

