'use client';

import React from 'react';
import { twMerge } from 'tailwind-merge';

export default function LabelValue({ label, className, children }: {
  label: string,
  className?: string,
  children?: React.ReactNode,
}) {
  return (
    <div className={twMerge('flex flex-row justify-between', className)}>
      <label className='!text-[10px] text-gray-600'>{label}</label>
      <span className='text-[11px]'>{children}</span>
    </div>
  )
}

