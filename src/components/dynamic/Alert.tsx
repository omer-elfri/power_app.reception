'use client'

import React from "react";
import { twMerge } from "tailwind-merge";

import { useVisual } from "../../hooks/useVisual";
import { MdWarning } from "react-icons/md";
import { FaCheckCircle } from "react-icons/fa";

export type Infobulle = ["sucess" | "warning" | "error", string, string?];

export default function Alert({ className }: {
  className?: string,
}) {
  const { alerts, popAlert } = useVisual();

  const timer = React.useRef<NodeJS.Timeout | null>(null);
  const remaining = React.useRef(5000);
  const startedAt = React.useRef(0);

  const startTimer = React.useCallback(() => {
      if (timer.current || alerts.length === 0)
        return;
      startedAt.current = Date.now();
      timer.current = setTimeout(() => {
        popAlert();
        remaining.current = 5000;
        timer.current = null;
      }, remaining.current);
  }, [alerts.length, popAlert]);

  const pauseTimer = React.useCallback(() => {
      if (!timer.current) return;
      clearTimeout(timer.current);
      timer.current = null;
      remaining.current -= Date.now() - startedAt.current;
  }, []);

  React.useEffect(() => {
      remaining.current = 5000;
      startTimer();
      return pauseTimer;
  }, [alerts, startTimer, pauseTimer]);

  if (alerts.length === 0) return null;

  return (
    <div className="fixed top-5 left-0 right-0 flex flex-col items-center z-110"
      onMouseEnter={pauseTimer}
      onMouseLeave={startTimer}
      onClick={popAlert}>
      { alerts.slice(0,3).map((alert, i) => (
        <InfobulleNotif key={i} alert={alert} className={
          twMerge("shadow-md", className,
            i === 0 ? "z-3 hover:scale-102 cursor-pointer" :
            i === 1 ? "z-2 scale-80 mt-[-45px]" :
            i === 2 ? "z-1 scale-60 mt-[-45px]" : "" )}
        />
      )) }
    </div>
  );
}

export function InfobulleNotif({ className, alert }: {
  className?: string,
  alert: Infobulle,
}) {
  return (
    <div className={twMerge("rounded-md overflow-hidden shadow", className)}
      style={{ backgroundImage: "url('/notif2.jpeg')", backgroundSize: 'cover' }}>
      
      <div className={twMerge("grid grid-cols-[auto_1fr] items-center gap-x-3 gap-y-1 \
          min-w-70 max-w-[80vw] text-[12px] font-bold px-5 py-3 backdrop-blur-sm",
        alert[0] === 'sucess' ? "bg-gray-200 text-green-800" :
        alert[0] === 'warning' ? "bg-gray-200 text-yellow-800" :
        alert[0] === 'error' ? "bg-gray-200 text-red-800" :
        "bg-gray-200 text-black") }>

        <div className="row-span-2 textwhite">
          { alert[0] === 'sucess' && <FaCheckCircle size={30} className="" /> }
          { alert[0] === 'warning' && <MdWarning size={30} className="" /> }
          { alert[0] === 'error' && <MdWarning size={30} className="" /> }
        </div>

        <div className=" text-[11px]">
          <h2>{
            alert.length === 3 ? alert[1] :
            alert[0] === 'sucess' ? "Réussie" :
            alert[0] === 'warning' ? "Avertissement" :
            alert[0] === 'error' ? "Erreur" : null
          }</h2>
        </div>

        <span className="text-gray-600 text-[11px]">{ alert.length === 3 ? alert[2] : alert[1]}</span>

      </div>

    </div>
  );
}

