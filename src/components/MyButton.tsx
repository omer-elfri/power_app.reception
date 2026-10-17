import React from "react";
import { twMerge } from "tailwind-merge";

export default function MyButton({ icon, iconRight, name, children, onClick, className, disabled }: {
    icon?: React.ReactNode,
    iconRight?: React.ReactNode,
    children?: string,
    onClick?: () => void,
    name?: string,
    className?: string,
    disabled?: boolean,
}) {
    if (iconRight) return (
        <button type='submit' name={name} onClick={onClick} disabled={disabled}
            className={twMerge("bg-blue-400/30 text-[10px]", className)}>
            { icon }
            { children && <span className="w-full text-left">{children}</span>}
            { iconRight }
        </button>
    );
    return (
        <button type='submit' name={name} onClick={onClick} disabled={disabled}
            className={twMerge("bg-blue-400/30 text-[10px]", className)}>
            { icon }
            { children && <span className="w-full text-center">{children}</span> }
        </button>
    );
}
