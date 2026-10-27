"use client";

import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { State } from "../types";
import Employer from "../types/employer";

type AuthContextType = {
    isAuth: () => AuthSession,
    connect: (userId: Employer.Id, password: string) => void,
    disconnect: () => void,
    authSession: AuthSession | null,
    setAuthSession: State<AuthSession | null>,
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [authSession, setAuthSession] = React.useState<AuthSession | null>({
        id: 'Hillary',
        name: 'ADMIN',
    });
    const { pathname } = useLocation();
    const navigate = useNavigate();

    React.useEffect(() => {
        if (!authSession && pathname !== '/')
            navigate("/");
        if (authSession && pathname === '/')
            navigate("/preview");
    }, [authSession, pathname, navigate]);

    React.useEffect(() => {
        let logoutTimer: ReturnType<typeof setTimeout>;
        if (!authSession) return;

        const resetTimer = () => {
            clearTimeout(logoutTimer);
            logoutTimer = setTimeout(() => {
                setAuthSession(null);
            }, 2 * 60 * 1000);
        };
        resetTimer();
        window.addEventListener('mousemove', resetTimer);
        return () => {
            clearTimeout(logoutTimer);
            window.removeEventListener('mousemove', resetTimer);
        }
    }, [authSession]);

    const connect = React.useCallback((userId: Employer.Id, password: string) => {
        userId;
        password;
        // const user = employer_table.getId(userId);
        // if (user.pass !== password)
        //     throw new Error("Identifiants incorrects");
        // setAuthSession({ id: userId, name: user.name, });
    }, []);

    const disconnect = React.useCallback(() => setAuthSession(null), []);

    const isAuth = React.useCallback(() => {
        if (!authSession)
            throw Error("Vous devez être connecté");
        return authSession;
    }, [authSession]);

    return (
        <authContext.Provider value={{
            isAuth,
            connect,
            disconnect,
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
