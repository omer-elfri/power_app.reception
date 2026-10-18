import React from 'react';
import { twMerge } from 'tailwind-merge';

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

