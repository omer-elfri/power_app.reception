import React from 'react';
import { twMerge } from 'tailwind-merge';
import { Bar } from './SectionBox';

type sideDivProps = {
    icon?: React.ReactNode,
    title?: React.ReactNode,
    right?: React.ReactNode,
    bottom?: React.ReactNode,
    className?: string,
    subClassName?: string,
    children?: React.ReactNode,
    bar?: boolean,
}

export default function FormAside({ onSubmit, className, ...props }: sideDivProps & {
    onSubmit: (e: React.SubmitEvent<HTMLFormElement>) => void,
}) {
    return (
        <form onSubmit={onSubmit} className={twMerge('bg-white/60 px-3 py-3 font-bold rounded shadow-md w-full', className)}>
            <AsideDiv topClassName='h-full' {...props} />
        </form>
    );
}

export function AsideDiv({ icon, title, right, bottom, className, topClassName, subClassName, children, bar=true }: sideDivProps & {
    topClassName?: string,
}) {
    return (
        <div className={twMerge("flex flex-col gap-y-2", topClassName ?? "bg-white/60 px-3 py-3 font-bold rounded shadow-md", className)}>

            <div className="flex flex-row items-center flex-wrap gap-2">
                { icon }
                { title && <div className="text-[12px] flex-1">{title}</div> }
                { right }
            </div>

            { bar && <Bar /> }

            <div className={twMerge("flex flex-col gap-2 flex-1", subClassName)}>
                { children }
            </div>

            { bottom }

        </div>
    );
}

