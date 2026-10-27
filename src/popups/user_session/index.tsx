'use client';

import Popup from "..";
import { RiResetLeftFill } from "react-icons/ri";
import { IoMdPower } from "react-icons/io";
import { twMerge } from "tailwind-merge";
import { useAuth } from "../../hooks/useAuth";
import { useDataContext } from "../../hooks";
import React from "react";

export default function SessionPopup({ className }: {
  className?: string,
}) {
  const { disconnect } = useAuth();
  const { switchPopup, unPopup } = useDataContext();

  return (
    <div onClick={e => e.stopPropagation()} className={twMerge("grid grid-cols-[150px_150px] gap-15 text-center text-white", className)}>

      <Button icon={<RiResetLeftFill size={60} />}
        onClick={() => { switchPopup(['CHANGE_PASS'])}}
        className="bg-blue-700">Changer de <br />mot de passe
      </Button>

      <Button icon={<IoMdPower size={60} />}
        onClick={() => { unPopup(), disconnect()}}
        className="bg-red-700">Se déconnecter
      </Button>

    </div>
  );
}

function Button({ icon, className, children, onClick }: {
  icon: React.ReactNode,
  className?: string,
  children: React.ReactNode,
  onClick?: () => void,
}) {
  return (
    <div onClick={onClick} className={twMerge("flex flex-col items-center gap-3 shadow \
        rounded p-3 animate-1 cursor-pointer hover:scale-105 transition-transform duration-700 ease-in-out", className)}>
      { icon }
      <p className="font-bold text-[13px]">{ children }</p>
    </div>
  );
}

