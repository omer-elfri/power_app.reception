import React from 'react';
import { twMerge } from 'tailwind-merge';
import { IconType } from 'react-icons/lib';

export default function NoElem({ className, Icon, size=40, text, list, children }: {
  Icon?: IconType,
  size?: number,
  className?: string,
  text: string,

  list: any[],
  children: React.ReactNode,
}) {
  if (list.length > 0) return children;

  return (
    <div className={twMerge('flex flex-col justify-center items-center \
        gap-4 w-full h-[90%] text-gray-500/50 text-[12px] font-bold', className)}>

      { Icon && <Icon size={size} /> }

      <span>{text}</span>

    </div>
  );
}

