"use client";

import React from "react";
import { PopupType, State } from "../types";
import { Infobulle } from "../components/Alert";

export type VisualContextType = {
    alerts: Infobulle[],
    addAlert: (alert: Infobulle) => void,
    popAlert: () => void,
    checkError: (handler : () => Promise<void>) => Promise<void>,

    popupList: PopupType[],
    addPopup: (pop: PopupType) => void,
    switchPopup: (pop: PopupType) => void,
    unPopup: () => void,

    loading: boolean,
    setLoading: State<boolean>,
};

export function VisualProvider({ children }: {
    children: React.ReactNode
}) {
    const [popupList, setPopupList] = React.useState<PopupType[]>([]);
    const [alerts, setAlerts] = React.useState<Infobulle[]>([]);
    const [loading, setLoading] = React.useState(false);

    const addAlert = React.useCallback((alert: Infobulle) => {
        setAlerts(alerts => [ alert, ...alerts ]);
        // const notifications = localStorage.getItem('notifications') ?? "";
        // localStorage.setItem('notifications', [
        //     alert, strToDate<Infobulle>(notifications),
        // ].toString())
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


    const checkError = React.useCallback(async (
        handler : () => Promise<void>
    ) => {
        try {
            await handler();
        }
        catch (alert) {
            addAlert(alert as Infobulle);
        }
    }, []);


    return (
        <visualContext.Provider value={{
            popupList, addPopup, switchPopup, unPopup,
            alerts, addAlert, popAlert, checkError,
            loading, setLoading,
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

