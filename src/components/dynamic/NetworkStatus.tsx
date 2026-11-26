'use client'

import React from "react";
import { twMerge } from "tailwind-merge";
import { useVisual } from "../../hooks/useVisual";

export default function NetworkStatus({ className }: {
    className?: string,
}) {
    const { online } = useVisual();
    const [show, setShow] = React.useState(false);

    React.useEffect(() => {
        setShow(true);
        if (!online) return;
        const id = setTimeout(() => setShow(false), 3000);
        return () => clearTimeout(id);
    }, [online]);

    return (
        <div className={twMerge("z-91 fixed bottom-5 left-0 right-0 flex justify-center pointer-events-none", className)}>
            <div className={twMerge(
              "px-5 py-3 min-w-[500px] text-center rounded font-bold uppercase",
              "backdrop-blur-md shadow transition-all duration-500 ease-in-out",
              online
                ? "bg-green-800/30 text-green-800"
                : "bg-yellow-800/30 text-yellow-800",
              show
                ? "translate-y-0 opacity-100"
                : "translate-y-[calc(100%+20px)] opacity-0"
            )}>
              { online ? "Connecté à internet" : "Aucune connexion à internet" }
            </div>
        </div>
    );
}

