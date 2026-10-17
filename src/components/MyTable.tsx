import React from 'react';
import { twMerge } from 'tailwind-merge';

export default function MyTable<T>({ top, datas, children, className, trClassName, color }: {
  top?: React.ReactNode[],
  datas: T[],
  children: (value: T, i: number) => React.ReactNode,
  className?: string,
  trClassName?: string,
  color?: string,
}) {
  return (
    <div className={twMerge('flex flex-col', className)}>

      <MyTr className={twMerge('font-bold text-[11px]', trClassName)}>{ top }</MyTr>

      { datas.map((elem, i) =>
        <MyTr key={i} index={i} color={color}
          className={twMerge('font-bold text-[12px] text-gray-800', trClassName)}
        > { children(elem, i) }
        </MyTr>
      ) }

    </div>
  );
}

export function MyTr({ children, className, color, index=1, onClick }: {
  children: React.ReactNode,
  className?: string,
  color?: string,
  index?: number,
  onClick?: () => void,
}) {
  return (
      <div className={twMerge('grid gap-2 py-1 text-center text-[12px]', className)}
        style={{ backgroundColor: index%2===0 ? color : "" }} onClick={onClick}>
        { children }
      </div>  
  );
}

