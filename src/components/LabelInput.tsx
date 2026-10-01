import React from "react";
import { twMerge } from "tailwind-merge";

export default function LabelInput({ label, type="text", name, options, className, children, required, defaultVal }: {
    label: string,
    name: string,
    options?: { k: string, value: string }[],
    required?: boolean,
    className?: string,
    children?: React.ReactNode,
    type?: string,
    defaultVal?: string,
}) {
    let res: React.ReactNode = children;

    if (options) res = (
        <select name={name} className="text-[11px] font-bold h-7" defaultValue={defaultVal}>
            { options.map((option) => (
                <option key={option.k} value={option.k}>{option.value}</option>
            )) }
        </select>
    );

    if (!res) res = (
        <input name={name} type={type} className="text-[11px] px-3 h-7" defaultValue={defaultVal} />
    );

    return (
        <div className={twMerge("flex flex-col gap-1", className)}>
            <label>
                <span className="text-[11px]">{label} </span>
                { required && <span className="text-red-700">*</span> }
            </label>
            { res }
        </div>
    );
}
