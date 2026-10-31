"use client";

import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { State } from "../types";
import Employer from "../types/employer";
import { supabase } from "../tools/supabase";
import { Config, useConfig } from "./bd/useConfig";

type AuthContextType = {
    employer_table: Config<Employer.Type>,
    isAuth: () => AuthSession,

    connect: (userId: Employer.Id, password: string) => void,
    disconnect: () => void,
    authSession: AuthSession | null,
    setAuthSession: State<AuthSession | null>,
    loading: boolean,
    setLoading: State<boolean>,

    receptionnists: Employer.Type[],
    cleaners: Employer.Type[],
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const navigate = useNavigate();
    const { pathname } = useLocation();
    const employer_table = useConfig<Employer.Type>('employer_table');
    const [authSession, setAuthSession] = React.useState<AuthSession | null>(null);
    const [loading, setLoading] = React.useState(false);

    const receptionnists = React.useMemo(() => {
        return employer_table.list.filter(employer =>
            employer.rules.includes('receptionnist'));
    }, [employer_table]);

    const cleaners = React.useMemo(() => {
        return employer_table.list.filter(employer =>
            employer.rules.includes('cleaner'));
    }, [employer_table]);




    React.useEffect(() => {
        if (!authSession && pathname !== '/')
            navigate("/");
        if (authSession && pathname === '/')
            navigate("/preview");
    }, [authSession, pathname, navigate]);

    



    React.useEffect(() => {
        (async () => {
            if (employer_table.list.length === 0)
                return;
            const uuid = (await supabase.auth.getSession())
                .data.session?.user.id;
            if (!uuid) { setAuthSession(null); return; }
            const employer = employer_table.list
                .find(employer => employer.auth_user_id === uuid);
            if (!employer) { setAuthSession(null); return; }
            setAuthSession(employer);
        })();
    }, [supabase.auth, employer_table.list]);

    // React.useEffect(() => {
    //     let logoutTimer: ReturnType<typeof setTimeout>;
    //     if (!authSession) return;

    //     const resetTimer = () => {
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
    //     }
    // }, [authSession]);

    const connect = React.useCallback((userId: Employer.Id, password: string) => {
        userId;
        (async () => {
            const { error } = await supabase.auth.signInWithPassword({
                email: 'romuald@reinehotel.bj',
                password,
            });
            if (error) throw error;
            // console.log(data.user);
        })();
        // const user = employer_table.getId(userId);
        // if (user.pass !== password)
        //     throw new Error("Identifiants incorrects");
        // setAuthSession({ id: userId, name: user.name, });
    }, []);

    const disconnect = React.useCallback(() => setAuthSession(null), []);

    const isAuth = React.useCallback(() => {
        if (!authSession)
            throw Error("Vous devez être connecté");
        console.log("authSession", authSession.id)
        return authSession;
    }, [authSession]);

    return (
        <authContext.Provider value={{
            employer_table,

            receptionnists,
            cleaners,

            isAuth,
            connect,
            disconnect,
            authSession,
            setAuthSession,
            loading, setLoading,
        }}> { children }
        </authContext.Provider>
    );
}


export type AuthSession = Employer.Type & {
}

const authContext = React.createContext<AuthContextType | null>(null);

export function useAuth() {
    const context = React.useContext(authContext);

    if (!context) {
        throw new Error("useAuthContext doit être utilisé dans AuthProvider");
    }
    return context;
}
