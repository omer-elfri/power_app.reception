'use client';

import React from 'react';
import { twMerge } from 'tailwind-merge';
import { Bar } from './SectionBox';

export default function FormAside({ icon, title, right, className, subClassName, children, onSubmit, bar=true }: {
    icon?: React.ReactNode,
    title: string,
    right?: React.ReactNode,
    className?: string,
    subClassName?: string,
    children?: React.ReactNode,
    onSubmit?: (e: React.SubmitEvent<HTMLFormElement>) => void,
    bar?: boolean,
}) {
    return (
        <form className={twMerge("bg-white/60 flex flex-col gap-y-2 px-3 py-3 rounded shadow-md", className)} onSubmit={onSubmit}>

            <div className="flex flex-row justify-between items-center flex-wrap gap-2">
                { icon }
                <h2 className="text-[12px] flex-1">{title}</h2>
                { right }
            </div>

            { bar && <Bar /> }

            <div className={twMerge("flex flex-col gap-2 flex-1", subClassName)}>
                { children }
            </div>

        </form>
    );
}
