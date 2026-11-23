import React from "react";
import { twMerge } from "tailwind-merge";

export default function MyButton({ icon, iconRight, name, children, onClick, className, style, disabled }: {
    icon?: React.ReactNode,
    iconRight?: React.ReactNode,
    children?: React.ReactNode,
    onClick?: () => void,
    name?: string,
    className?: string,
    style?: React.CSSProperties,
    disabled?: boolean,
}) {
    return (
        <button type='submit' name={name} value={name} onClick={onClick} disabled={disabled}
            className={twMerge("bg-blue-400/30 text-[10px] hover:scale-95", className,
                disabled && "border-1 border-gray-600 bg-transparent text-gray-600")}
            style={disabled ? {} : style}>
            { icon }
            { children && <span className="w-full">{children}</span> }
            { iconRight }
        </button>
    );
}

