'use client'

import React from "react";
import { twMerge } from "tailwind-merge";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { IoPersonCircle } from "react-icons/io5";
import { FaPlus } from "react-icons/fa";
import MyLink from "./MyLink";
import { useAuth } from "../hooks/useAuth";

export default function PageTitle({ className, children }: {
    className?: string,
    children?: React.ReactNode,
}) {
    const { authSession, disconnect } = useAuth();
    const { pathname } = useLocation();
    const navigate = useNavigate();

    return (
        <div className={twMerge("flex flex-row justify-between items-center gap-3 pt-5", className)}>

            <div className="flex flex-row items-center gap-2">
                <img width={30} height={30} src="/power_icon.png" alt="" />
                <h1 className="text-[16px] font-bold text-[12px] uppercase">Hotel electricity</h1>
            </div>

            <div className="flex flex-row justify-center min-w-50 gap-4 flex-1 text-[14px] font-bold">
                <Link to="/preview" className={twMerge("text-gray-500 pb-3", pathname === '/preview' ? "border-b-2 text-green-700 border-green-700" : "")}>Aperçu global</Link>
                <Link to="/rooms" className={twMerge("text-gray-500 pb-3", pathname.startsWith('/rooms') ? "border-b-2 text-red-700 border-red-700" : "")}>Chambres</Link>
            </div>

            <button className="bg-blue-500 text-white" onClick={() => navigate('/rooms/001')}>
                <FaPlus /> <span>Réservation</span>
            </button>

            <div className="flex justify-center items-center gap-1 p-1 pr-3 rounded-full bg-blue-500/30 cursor-pointer" onClick={disconnect}>
                <IoPersonCircle size={23} className="text-blue-600" />
                <span className="font-bold text-[13px] uppercase">{authSession?.name}</span>
            </div>

            { children }

        </div>
    );
}
