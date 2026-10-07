"use client";

import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { State } from "../types";
import Employer from "../types/employer";
import { employers_datas } from "../configs/employer";

export type AuthSession = {
    id: Employer.Id,
    name: string,
}

type AuthContextType = {
    isAuth: () => AuthSession,
    authSession: AuthSession | null,
    setAuthSession: State<AuthSession | null>,
};

const authContext = React.createContext<AuthContextType | null>(null);

export function useAuth() {
    const context = React.useContext(authContext);

    if (!context) {
        throw new Error("useAuthContext doit être utilisé dans AuthProvider");
    }
    return context;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [authSession, setAuthSession] = React.useState<AuthSession | null>({
        id: 'receptionist1',
        name: employers_datas['receptionist1'].name,
    });
    const { pathname } = useLocation();
    const navigate = useNavigate();

    React.useEffect(() => {
        if (!authSession && pathname !== '/login')
            navigate("/login");
    }, [authSession, pathname]);

    const isAuth = React.useCallback(() => {
        if (!authSession)
            throw Error("Vous devez être connecté");
        return authSession;
    }, []);

    return (
        <authContext.Provider value={{
            isAuth,
            authSession,
            setAuthSession,
        }}> { children }
        </authContext.Provider>
    );
}

