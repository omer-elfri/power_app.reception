'use client';

import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Config, ConfigType, useConfig } from "./useConfig";
import { useVisual } from "./useVisual";
import { supabase } from "../tools/supabase";
import Employer from "../types/employer";

type AuthContextType = {
    isAuth: () => Employer.Type,
    employer_table: Config<Employer.Type>,
    receptionnists: ConfigType<Employer.Type>[],
    cleaners: ConfigType<Employer.Type>[],
    logged: ConfigType<Employer.Type> | null,

    loggedEmail: string | null,
    connect: (email: string, password: string) => Promise<void>,
    disconnect: () => Promise<void>,
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const navigate = useNavigate();
    const { checkAlert } = useVisual();
    const { pathname } = useLocation();
    const [loggedEmail, setLoggedEmail] = React.useState<string | null>(null);

    React.useEffect(() => { // is loggedEmail or not
        const { data: { subscription } } = supabase.auth
            .onAuthStateChange( async (_, session) => {
                const email = session?.user.email;
                setLoggedEmail(email ?? null);
            });
        return subscription.unsubscribe;
    }, [supabase.auth]);

    React.useEffect(() => { // redirect if is not connected
        if (!loggedEmail && pathname !== '/') navigate("/");
        if (loggedEmail && pathname === '/') navigate("/preview");
    }, [loggedEmail, pathname, navigate]);










    const employer_table = useConfig<Employer.Type>('employer_table', {
        filter: () => supabase.rpc('get_employers'),
    });

    const logged = React.useMemo(() => {
        if (!loggedEmail) return null;
        return employer_table.list.find(employer =>
            employer.rules.includes('receptionnist') &&
            employer.email === loggedEmail) ?? null;
    }, [employer_table, loggedEmail]);

    const isAuth = React.useCallback(() => {
        if (!logged)
            throw Error("Vous devez être connecté");
        return logged;
    }, [logged]);

    const receptionnists = React.useMemo(() => {
        return employer_table.list.filter(employer =>
            employer.rules.includes('receptionnist') );
    }, [employer_table.list]);

    const cleaners = React.useMemo(() => {
        return employer_table.list.filter(employer =>
            employer.rules.includes('cleaner'));
    }, [employer_table.list]);









    // React.useEffect(() => { // on mouse stay loggedEmail, else disconnected
    //     if (!loggedEmail) return;
    //     let logoutTimer: ReturnType<typeof setTimeout>;

    //     const resetTimer = () => {
    //         clearTimeout(logoutTimer);
    //         logoutTimer = setTimeout(disconnect, 2*60*1000);
    //     };
    //     resetTimer();
    //     window.addEventListener('mousemove', resetTimer);
    //     return () => {
    //         clearTimeout(logoutTimer);
    //         window.removeEventListener('mousemove', resetTimer);
    //     }
    // }, [loggedEmail]);

    const connect = React.useCallback(async (
        email: string,
        password: string,
    ) => {
        await checkAlert(async () => {
            await new Promise(resolve => setTimeout(resolve, 1000));
            const { data, error } = await supabase.auth
                .signInWithPassword({ email, password, });
            if (error || !data.session) {
                setLoggedEmail(null);
                if (error?.code === 'invalid_credentials')
                    throw ['error', "Identifiants incorrects"];
                throw ['error', "Une erreur est survenue !"];
            }
            throw ['sucess', "Connecté avec succès !"];
        });
    }, [checkAlert]);

    const disconnect = React.useCallback(async () => {
        supabase.auth.signOut();
        setLoggedEmail(null);
    }, []);


    return (
        <authContext.Provider value={{
            isAuth,
            employer_table,
            receptionnists,
            cleaners,
            logged,

            loggedEmail,
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

