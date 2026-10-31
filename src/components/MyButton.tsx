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
    return (
        <button type='submit' name={name} onClick={onClick} disabled={disabled}
            className={!disabled ? twMerge("bg-blue-400/30 text-[10px] hover:scale-95", className) : ''}>
            { icon }
            { children && <span className="w-full text-center">{children}</span> }
            { iconRight }
        </button>
    );
}

