'use client';

import React from 'react';

export default function LabelValue({ label, children }: {
  label: string,
  children: React.ReactNode,
}) {
  return (
    <div className='flex flex-row justify-between'>
      <label className='!text-[10px]'>{label}</label>
      <p className='!text-[10px]'>{children}</p>
    </div>
  )
}

