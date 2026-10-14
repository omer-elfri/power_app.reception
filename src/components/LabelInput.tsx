import React from "react";
import { twMerge } from "tailwind-merge";

export default function LabelInput({ onChangeText, label, type="text", name, value, options, className, inputClassName, children, required, defaultValue, ...props }: React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> & {
    label?: string,
    name?: string,
    options?: { k: string, value?: string, disabled?: boolean }[],
    required?: boolean,
    className?: string,
    inputClassName?: string,
    // subClassName?: string,
    children?: React.ReactNode,
    type?: string,
    defaultValue?: string,
    value?: string,
    onChangeText?: (value: string) => void,
}) {
    let res: React.ReactNode = children;

    if (options) res = (
        <select id={name} name={name} value={value} defaultValue={defaultValue}
            className={twMerge("w-full font-bold text-[11px] h-7", inputClassName)}
            onChange={e => onChangeText?.(e.target.value)}>
            { options.map((option) => (
                <option key={option.k} value={option.k} disabled={option.disabled}>
                    {option.value ?? option.k}
                </option>
            )) }
        </select>
    );

    if (!res) res = (
        <input id={name} name={name} type={type} value={value} defaultValue={defaultValue}
            onChange={e => onChangeText?.(e.target.value)} {...props}
            className={twMerge("w-full font-bold text-[11px] px-3 h-7", inputClassName)}
        />
    );

    return (
        <div className={twMerge("flex flex-col gap-1", className)}>
            { label && <label htmlFor={name} className="font-bold">
                <span className="text-[11px]">{label} </span>
                { required && <span className="text-red-700">*</span> }
            </label> }
            { res }
            {/* <div className={twMerge("[&>*]:w-full [&>*]:h-full flex-1 bg-green-400", subClassName)}>{ res }</div> */}
        </div>
    );
}
