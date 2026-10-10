"use client";

import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { State, TypeWithTrace } from "../types";
import Employer from "../types/employer";
import { employers_datas } from "../configs/employer";
import BedRoom from "../types/bedroom";

type AuthContextType = {
    isAuth: () => AuthSession,
    connect: (userId: Employer.Id, password: string) => void,
    disconnect: () => void,
    addTrace: <T extends Object>(id: number, roomId: BedRoom.Id, data: T) => TypeWithTrace<T>,
    authSession: AuthSession | null,
    setAuthSession: State<AuthSession | null>,
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [authSession, setAuthSession] = React.useState<AuthSession | null>({
        id: 'receptionist1',
        name: "admin",
    });
    const { pathname } = useLocation();
    const navigate = useNavigate();

    React.useEffect(() => {
        if (!authSession && pathname !== '/')
            navigate("/");
        if (authSession && pathname === '/')
            navigate("/preview");
    }, [authSession, pathname, navigate]);

    // React.useEffect(() => {
    //     let logoutTimer: ReturnType<typeof setTimeout>;
    //     if (!authSession) return;

    //     let i = 0;

    //     const t = setInterval(() => {
    //         console.log(++i);
    //     }, 1000);

    //     const resetTimer = () => {
    //         i = 0;
    //         clearTimeout(logoutTimer);
    //         logoutTimer = setTimeout(() => {
    //             setAuthSession(null);
    //         }, 2 * 60 * 1000);
    //     };
    //     resetTimer();
    //     window.addEventListener('mousemove', resetTimer);
    //     return () => {
    //         clearTimeout(logoutTimer);
    //         window.removeEventListener('mousemove', resetTimer);

    //         clearInterval(t);
    //     }
    // }, [authSession]);

    const connect = React.useCallback((userId: Employer.Id, password: string) => {
        const user = employers_datas[userId];
        if (user.pass !== password)
            throw new Error("Identifiants incorrects");
        setAuthSession({
            id: userId,
            name: user.name,
        });
    }, []);

    const disconnect = React.useCallback(() => {
        setAuthSession(null);
    }, []);

    const isAuth = React.useCallback(() => {
        if (!authSession)
            throw Error("Vous devez être connecté");
        return authSession;
    }, [authSession]);

    const addTrace = React.useCallback(<T extends Object>(
        id: number, roomId: BedRoom.Id, data: T
    ): TypeWithTrace<T> => {
        if (!authSession) throw Error("Vous devez vous connecté");
        return ({ ...data, id, roomId,
            date: new Date(Date.now()),
            auth_session: authSession.id,
        });
    }, [isAuth]);

    return (
        <authContext.Provider value={{
            isAuth,
            connect,
            disconnect,
            addTrace,
            authSession,
            setAuthSession,
        }}> { children }
        </authContext.Provider>
    );
}


export type AuthSession = {
    id: Employer.Id,
    name: string,
}

const authContext = React.createContext<AuthContextType | null>(null);

export function useAuth() {
    const context = React.useContext(authContext);

    if (!context) {
        throw new Error("useAuthContext doit être utilisé dans AuthProvider");
    }
    return context;
}
