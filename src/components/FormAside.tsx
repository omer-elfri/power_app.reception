import React from 'react';
import { twMerge } from 'tailwind-merge';
import { Bar } from './SectionBox';
import { getString } from '../tools';

type sideDivProps = {
    icon?: React.ReactNode,
    title?: React.ReactNode,
    right?: React.ReactNode,
    bottom?: React.ReactNode,
    className?: string,
    subClassName?: string,
    children?: React.ReactNode,
    no_bar?: boolean,
    nb?: number,
    onClick?: () => void,
}

export default function FormAside({ onSubmit, className, ...props }: sideDivProps & {
    onSubmit: (e: React.SubmitEvent<HTMLFormElement>) => void,
}) {
    return (
        <form onSubmit={e => { e.preventDefault(); onSubmit(e); }}
            className={twMerge('bg-white/60 px-3 py-3 font-bold rounded shadow-md w-full', className)}>
            <AsideDiv topClassName='h-full' {...props} />
        </form>
    );
}

export function AsideDiv({ icon, title, no_bar = false, onClick, nb, right, bottom, className, topClassName, subClassName, children }: sideDivProps & {
    topClassName?: string,
}) {
    return (
        <div onClick={onClick} className={twMerge("flex flex-col gap-y-2", topClassName ?? "bg-white/60 px-3 py-3 font-bold rounded shadow-md", className)}>

            { title && <>
                <div className="flex flex-row items-center flex-wrap gap-2 text-[12px]">
                    { icon }
                    { title && <div className="flex-1">{title}</div> }
                    { right }
                    { nb ? <div className="text-gray-500">{ getString(nb) }</div> : null }
                </div>
                { !no_bar && <Bar /> }
            </> }

            { children && (
                <div className={twMerge("flex flex-col gap-2 flex-1", subClassName)}>
                    { children }
                </div>
            ) }

            { bottom }

        </div>
    );
}

