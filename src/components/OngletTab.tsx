'use client';

import React from 'react';
import { twMerge } from 'tailwind-merge';

export type OngletType<T=string> = {
  key: T,
  icon?: React.ReactNode,
  value?: React.ReactNode,
  style?: string,
  rightIcon?: React.ReactNode,
  disabled?: boolean,
  tabStyle?: string,
}

type OngletDivProps<T> = {
  datas: [OngletType<T>, ...OngletType<T>[]],
  className?: string,
  subClassName?: string,
  children?: (data: OngletType<T>) => React.ReactNode,
}

export default function OngletDiv<T extends string>({ ...props }: OngletDivProps<T> & {
  onglet?: OngletType<T>, setOnglet?: (elem: OngletType<T>) => void
}) {
  const [onglet, setOnglet] = React.useState(props.datas[0]);

  return (
    <OngletDiv1 {...props}
      onglet={props.onglet ?? onglet}
      setOnglet={props.setOnglet ?? setOnglet}
    />
  );
}

function OngletDiv1<T extends string>({
  datas, className, subClassName, children,
  onglet, setOnglet,
}: OngletDivProps<T> & { onglet: OngletType<T>, setOnglet: (elem: OngletType<T>) => void }) {

  const OngletTab = React.useCallback(({ elem }: {
    elem: OngletType<T>,
  }) => {
    return (
      <div key={elem.key} className={twMerge(
          "flex flex-row gap-2 items-center text-[12px] px-3 py-2 rounded cursor-pointer border-1 border-gray-400 text-gray-600",
          onglet.key === elem.key ? twMerge("bg-blue-500 text-white", elem.style, elem.tabStyle) : "black hover:bg-blue-400/20")}
        onClick={() => { !elem.disabled ? setOnglet(elem) : undefined }}>
        { elem.icon }
        <div className='flex-1'>{ elem.value ?? elem.key }</div>
        <div className='text-black'>{ elem.rightIcon }</div>
      </div>
    );
  }, [onglet]);

  return (
    <div className={twMerge("flex flex-col gap-3 flex-1 overflow-auto", className)}>

      <div className="grid grid-cols-[repeat(auto-fit,minmax(100px,1fr))] gap-3 rounded font-bold rounded-md">
        { datas.map(elem => <OngletTab key={elem.key} elem={elem} /> ) }
      </div>

      <div className={twMerge('flex flex-col gap-2 flex-1 overflow-auto', subClassName)}>
        { children?.(onglet) }
      </div>

    </div>
  );
}
