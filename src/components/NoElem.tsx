import React from 'react';
import { twMerge } from 'tailwind-merge';
import { IconType } from 'react-icons/lib';

export default function NoElem({ Icon, size=40, text="Aucun élément", list, className, children, bar=false }: {
  bar?: boolean,
  Icon?: IconType,
  size?: number,
  className?: string,
  text: string,
  list: any[],
  children?: React.ReactNode,
}) {
  if (list.length > 0) return children;

  return (
    <div className={twMerge('flex flex-col justify-center items-center gap-4 \
      text-gray-500/50 text-[12px] font-bold w-full h-full', className, bar && "border-t-1 border-gray-400/40")}>
      { Icon && <Icon size={size} /> }
      <span>{text}</span>
    </div>
  );
}

