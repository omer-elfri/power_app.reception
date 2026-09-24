import React from "react";
import { twMerge } from "tailwind-merge";
import { useLocation } from "react-router-dom";

export default function PageTitle({ className, children }: {
    name: string,
    className?: string,
    children?: React.ReactNode,
}) {
    const { pathname } = useLocation();

    return (
        // <div className="flex flex-row justify-between items-center flex-wrap gap-3 border-b-1 border-gray-400/50 py-5">
        <div className={twMerge("flex flex-row justify-between items-center flex-wrap gap-3 pt-5", className)}>

            <div className="flex flex-row items-center gap-2">
                <img width={30} height={30} src="/power_icon.png" alt="" />
                <h1 className="text-[16px] font-bold text-[12px] uppercase">Hotel electricity</h1>
            </div>
            {/* <h1 className="text-3xl font-bold">{name}</h1> */}
            <div className="flex flex-row justify-center gap-4 flex-1 text-[14px] font-bold">
                <a href="/" className={twMerge("text-gray-500 pb-3", pathname === '/' ? "border-b-2 text-green-700 border-green-700" : "")}>Aperçu global</a>
                <a href="/rooms" className={twMerge("text-gray-500 pb-3", pathname === '/rooms' ? "border-b-2 text-red-700 border-red-700" : "")}>Chambres</a>
            </div>
            {/* <input type="search" width={20} height={3} placeholder="Rechercher" className="border-1 py-1/2 px-2 rounded" /> */}
            <div className="relative"> <input type="search" placeholder="Rechercher..." className="w-50 rounded-lg border border-gray-200 bg-gray-50 py-[5px] pl-3 pr-3 text-sm text-gray-700 outline-none transition focus:border-gray-400 focus:bg-white" /> </div>
            <div className="flex flex-row items-center gap-4">{ children }</div>
        </div>
    );
}
