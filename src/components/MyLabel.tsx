import React from "react";
import { twMerge } from "tailwind-merge";

export default function MyLabel({ label, name, className, children, required }: {
    label: string,
    name?: string,
    className?: string,
    children?: React.ReactNode,
    required?: boolean,
}) {
    return (
        <div className={twMerge("flex flex-col gap-1", className)}>

            <label htmlFor={name} className="font-bold">
                <span className="text-[11px] font-bold">{label} </span>
                { required && <span className="text-red-700">*</span> }
            </label>

            { children }

        </div>
    );
}
