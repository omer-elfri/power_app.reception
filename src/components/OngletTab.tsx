'use client';

import React from 'react';
import { twMerge } from 'tailwind-merge';
import { State } from '../types';

export type OngletType<T=string> = {
  key: T,
  icon?: React.ReactNode,
  value: React.ReactNode,
  style?: string,
  rightIcon?: React.ReactNode,
  disabled?: boolean,
}

export default function OngletTab<T extends string>({
  onglet, setOnglet, datas,
  className, subClassName, children
}: {
  onglet: T,
  setOnglet: (key: T) => void | State<T>,
  datas: OngletType<T>[],
  children?: React.ReactNode,
  className?: string,
  subClassName?: string,
}) {

  const OngletTab = React.useCallback(({ elem }: {
    elem: OngletType<T>,
  }) => {
    return (
      <div key={elem.key} onClick={!elem.disabled ? () => setOnglet(elem.key) : undefined} className={twMerge(
        "flex flex-row gap-2 items-center text-[12px] px-3 py-2 rounded cursor-pointer border-1 border-gray-400",
        onglet === elem.key ? twMerge("bg-blue-500 text-white", elem.style) : "black hover:bg-blue-400/20")}>
        { elem.icon }
        { elem.value }
        <div className='flex-1' />
        { elem.rightIcon }
      </div>
    );
  }, [onglet]);

  return (
    <div className={twMerge("flex flex-col gap-3 flex-1 overflow-auto", className)}>

      <div className="grid grid-cols-[repeat(auto-fit,minmax(100px,1fr))] gap-3 rounded font-bold rounded-md">
        { datas.map(elem => <OngletTab key={elem.key} elem={elem} /> ) }
      </div>

      <div className={twMerge('flex flex-col gap-2 flex-1 overflow-auto', subClassName)}>
        { children }
      </div>

    </div>
  );
}
