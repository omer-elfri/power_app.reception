'use client';

import React from "react";
import { PopupType, State } from "../types";
import { Infobulle } from "../components/dynamic/Alert";
import { supabase } from "../tools/supabase";

export type VisualContextType = {
    alerts: Infobulle[],
    addAlert: (alert: Infobulle) => void,
    popAlert: () => void,
    checkAlert: (handler : () => Promise<void>) => Promise<void>,

    popupList: PopupType[],
    addPopup: (pop: PopupType) => void,
    switchPopup: (pop: PopupType) => void,
    unPopup: () => void,

    loading: boolean,
    setLoading: State<boolean>,
    online: boolean,
};

export function VisualProvider({ children }: {
    children: React.ReactNode,
}) {
    const [popupList, setPopupList] = React.useState<PopupType[]>([]);
    const [alerts, setAlerts] = React.useState<Infobulle[]>([]);
    const [loading, setLoading] = React.useState(false);
    const [online, setOnline] = React.useState(navigator.onLine);

    React.useEffect(() => { // online
        let mounted = true;
        let interval: ReturnType<typeof setInterval> | undefined;

        const check = async () => {
            const status = await (async () => {
                if (!navigator.onLine) return false;
                try {
                    const { error } = await supabase
                        .from('bedroom_table')
                        .select('id').limit(1);
                    return !error;
                } catch { return false; }
            })();
            if (mounted) setOnline(status);
        };
        const check2 = async () => {
            await check();
            await new Promise(() => {
                interval = setInterval(check, 3000);
            });
        };

        const onOnline = () => check();
        const onOffline = () => setOnline(false);
        window.addEventListener('online', onOnline);
        window.addEventListener('offline', onOffline);
        check2();

        return () => {
            mounted = false;
            clearInterval(interval);
            window.removeEventListener('online', onOnline);
            window.removeEventListener('offline', onOffline);
        };
    }, []);


    const addAlert = React.useCallback((alert: Infobulle) => {
        setAlerts(alerts => [ ...alerts, alert, ]);
        // const notifications = localStorage.getItem('notifications') ?? "";
        // localStorage.setItem('notifications', [
        //     alert[1], strToDate<Infobulle>(notifications),
        // ].toString())
    }, []);

    const checkAlert = React.useCallback(async (
        handler : () => Promise<void>
    ) => {
        try {
            await handler();
        }
        catch (alert) {
            addAlert(alert as Infobulle);
        }
    }, []);

    const popAlert = React.useCallback(() => {
        setAlerts(([_, ...alerts]) => alerts);
    }, []);


    const addPopup = React.useCallback((pop: PopupType) => {
        setPopupList(popupList => [ pop, ...popupList, ]);
    }, []);

    const switchPopup = React.useCallback((pop: PopupType) => {
        unPopup(); addPopup(pop);
    }, []);

    const unPopup = React.useCallback(() => {
        setPopupList(([_, ...popupList]) => popupList);
    }, []);


    return (
        <visualContext.Provider value={{
            popupList, addPopup, switchPopup, unPopup,
            alerts, addAlert, popAlert, checkAlert,
            loading, setLoading, online,
        }}>
            { children }
        </visualContext.Provider>
    );
}


const visualContext = React.createContext<VisualContextType | null>(null);

export function useVisual() {
    const context = React.useContext(visualContext);
    if (!context)
        throw new Error("useVisual doit être utilisé dans VisualProvider");
    return context;
}

