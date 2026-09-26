import React from "react";
import { twMerge } from "tailwind-merge";
import { useLocation, useNavigate } from "react-router-dom";
import { IoPersonCircle } from "react-icons/io5";
import { FaPlus } from "react-icons/fa";

export default function PageTitle({ className, children }: {
    className?: string,
    children?: React.ReactNode,
}) {
    const { pathname } = useLocation();
    const navigate = useNavigate();

    return (
        // <div className="flex flex-row justify-between items-center flex-wrap gap-3 border-b-1 border-gray-400/50 py-5">
        <div className={twMerge("flex flex-row justify-between items-center flex-wrap gap-3", className)}>

            <div className="flex flex-row items-center gap-2">
                <img width={30} height={30} src="/power_icon.png" alt="" />
                <h1 className="text-[16px] font-bold text-[12px] uppercase">Hotel electricity</h1>
            </div>

            {/* <h1 className="text-3xl font-bold">{name}</h1> */}
            <div className="flex flex-row justify-center min-w-50 gap-4 flex-1 text-[14px] font-bold">
                <a href="/" className={twMerge("text-gray-500 pb-3", pathname === '/' ? "border-b-2 text-green-700 border-green-700" : "")}>Aperçu global</a>
                <a href="/rooms" className={twMerge("text-gray-500 pb-3", pathname.startsWith('/rooms') ? "border-b-2 text-red-700 border-red-700" : "")}>Chambres</a>
            </div>

            {/* <input type="search" width={20} height={3} placeholder="Rechercher" className="border-1 py-1/2 px-2 rounded" /> */}
            {/* <input type="search" placeholder="Rechercher..." className="w-50 rounded-lg border border-gray-200 bg-gray-50 py-[5px] pl-3 pr-3 text-sm text-gray-700 outline-none transition focus:border-gray-400 focus:bg-white" /> */}
            <button className="bg-blue-500 text-white">
                <FaPlus />
                <span>Réservation</span>
            </button>
            <IoPersonCircle className="text-[30px] text-red-600 cursor-pointer" onClick={() => navigate("/login")} />
            { children }

        </div>
    );
}
