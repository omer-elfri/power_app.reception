"use client";

import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { Config, useConfig } from "./useConfig";
import Employer from "../types/employer";
import { supabase } from "../tools/supabase";
import { useVisual } from "./useVisual";

type AuthContextType = {
    employer_table: Config<Employer.Type>,
    receptionnists: Employer.Type[],
    cleaners: Employer.Type[],
    
    isAuth: () => Employer.Type,
    authSession: Employer.Auth | null,
    connect: (email: string, password: string) => Promise<void>,
    disconnect: () => Promise<void>,
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const { checkError } = useVisual();
    const navigate = useNavigate();
    const { pathname } = useLocation();
    const [authSession, setAuthSession] = React.useState<Employer.Auth | null>(null);
    const employer_table = useConfig<Employer.Type>('employer_table', () =>
        supabase.rpc('get_employers') );

    React.useEffect(() => {
        employer_table.read();
    }, []);

    React.useEffect(() => {
        if (!authSession && pathname !== '/')
            navigate("/");
        if (authSession && pathname === '/')
            navigate("/preview");
    }, [authSession, pathname, navigate]);

    const receptionnists = React.useMemo(() => {
        return employer_table.list.filter(employer =>
            employer.rules.includes('receptionnist'));
    }, [employer_table.list]);

    const cleaners = React.useMemo(() => {
        return employer_table.list.filter(employer =>
            employer.rules.includes('cleaner'));
    }, [employer_table.list]);



    React.useEffect(() => {
        const { data: { subscription } } = supabase.auth
            .onAuthStateChange(async (_, session) => {
                const email = session?.user.email;
                if (!email) { setAuthSession(null); return; }

                const employer = receptionnists.find(empl => empl.email === email);
                setAuthSession(employer ? { ...employer, email } : null);
            });
        return () => subscription.unsubscribe();
    }, [supabase, receptionnists]);

    
    // React.useEffect(() => { // on mouse stay connected, else disconnected
    //     if (!authSession) return;
    //     let logoutTimer: ReturnType<typeof setTimeout>;

    //     const resetTimer = () => {
    //         clearTimeout(logoutTimer);
    //         logoutTimer = setTimeout(disconnect, 2 * 60 * 1000);
    //     };
    //     resetTimer();
    //     window.addEventListener('mousemove', resetTimer);
    //     return () => {
    //         clearTimeout(logoutTimer);
    //         window.removeEventListener('mousemove', resetTimer);
    //     }
    // }, [authSession]);

    const isAuth = React.useCallback(() => {
        if (!authSession)
            throw Error("Vous devez être connecté");
        return authSession;
    }, [authSession]);

    const connect = React.useCallback(async (
        email: string,
        password: string,
    ) => {
        await checkError(async () => {
            await new Promise(resolve => setTimeout(resolve, 1000));
            const { data, error } = await supabase.auth
                .signInWithPassword({ email, password, });
            if (error || !data.session) {
                setAuthSession(null);
                if (error?.code === 'invalid_credentials')
                    throw ['error', "Identifiants incorrects"];
                throw ['error', "Une erreur est survenue !"];
            }
            throw ['sucess', "Connecté avec succès !"];
        });
    }, [receptionnists]);

    const disconnect = React.useCallback(async () => {
        supabase.auth.signOut();
        setAuthSession(null);
    }, []);



    return (
        <authContext.Provider value={{
            employer_table,
            receptionnists,
            cleaners,

            isAuth,
            authSession,
            connect,
            disconnect,
        }}> { children }
        </authContext.Provider>
    );
}


const authContext = React.createContext<AuthContextType | null>(null);

export function useAuth() {
    const context = React.useContext(authContext);

    if (!context) {
        throw new Error("useAuthContext doit être utilisé dans AuthProvider");
    }
    return context;
}

