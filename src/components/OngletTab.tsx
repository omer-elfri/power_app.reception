'use client';

import React from 'react';
import { twMerge } from 'tailwind-merge';
import { State } from '../types';

export default function OngletTab<T extends string>({ onglet, setOnglet, datas, className, subClassName, children }: {
  onglet: T,
  setOnglet: (key: T) => void | State<T>,
  datas: { key: T, value: React.ReactNode }[],
  children?: React.ReactNode,
  className?: string,
  subClassName?: string,
}) {
  return (
    <div className={twMerge("flex flex-col gap-3 flex-1", className)}>

      <div className="flex flex-row bg-gray-800 p-1 rounded font-bold">
        { datas.map(elem => (        
          <div key={elem.key} onClick={() => setOnglet(elem.key)} className={twMerge(
            "text-[12px] text-gray-800 px-3 py-1 rounded cursor-pointer",
            onglet === elem.key ? "bg-white" : "text-white")}>{elem.value}</div>
        )) }
      </div>

      <div className={twMerge('flex flex-col gap-2 flex-1 overflow-auto', subClassName)}>
        { children }
      </div>

    </div>
  );
}
