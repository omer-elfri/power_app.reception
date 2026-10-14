'use client';

import React from 'react';
import { twMerge } from 'tailwind-merge';
import { State } from '../types';

export default function OngletTab<T extends string>({ onglet, setOnglet, datas, className, subClassName, children }: {
  onglet: T,
  setOnglet: (key: T) => void | State<T>,
  datas: { key: T, icon: React.ReactNode, value: React.ReactNode }[],
  children?: React.ReactNode,
  className?: string,
  subClassName?: string,
}) {
  return (
    <div className={twMerge("flex flex-col gap-3 flex-1", className)}>

      <div className="grid grid-cols-[repeat(auto-fit,minmax(100px,1fr))] gap-3 rounded font-bold rounded-md">
        { datas.map(elem => (        
          <div key={elem.key} onClick={() => setOnglet(elem.key)} className={twMerge(
            "flex flex-row gap-2 items-center text-[12px] px-3 py-2 rounded cursor-pointer border-1 border-gray-400",
            onglet === elem.key ? "bg-blue-500 text-white" : "black")}>
            { elem.icon }
            <span>{elem.value}</span>
          </div>
        )) }
      </div>

      <div className={twMerge('flex flex-col gap-2 flex-1 overflow-auto', subClassName)}>
        { children }
      </div>

    </div>
  );
}
