import React from "react";
import { twMerge } from "tailwind-merge";

export default function LabelInput({ onChangeText, label, type="text", name, value, options, className, subClassName, children, required, defaultVal }: {
    label: string,
    name?: string,
    options?: { k: string, value: string, disabled?: boolean }[],
    required?: boolean,
    className?: string,
    subClassName?: string,
    children?: React.ReactNode,
    type?: string,
    defaultVal?: string,
    value?: string,
    onChangeText?: (value: string) => void,
}) {
    let res: React.ReactNode = children;

    if (options) res = (
        <select name={name} value={value} className="w-full font-bold text-[11px] h-7" onChange={e => onChangeText?.(e.target.value)} defaultValue={defaultVal}>
            { options.map((option) => (
                <option key={option.k} value={option.k} disabled={option.disabled}>
                    {option.value}
                </option>
            )) }
        </select>
    );

    if (!res) res = (
        <input name={name} type={type} value={value} onChange={e => onChangeText?.(e.target.value)} className="w-full font-bold text-[11px] h-7 px-3" defaultValue={defaultVal} />
    );

    return (
        <div className={twMerge("flex flex-col gap-1", className)}>
            <label>
                <span className="text-[11px]">{label} </span>
                { required && <span className="text-red-700">*</span> }
            </label>
            <div className={twMerge("", subClassName)}>{ res }</div>
        </div>
    );
}
