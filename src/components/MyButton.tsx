import React from "react";
import { twMerge } from "tailwind-merge";

export default function MyButton({ icon, name, children, onClick, className, disabled }: {
    icon?: React.ReactNode,
    children?: string,
    onClick?: () => void,
    name: string,
    className?: string,
    disabled?: boolean,
}) {
    return (
        <button type='submit' name={name} onClick={onClick} disabled={disabled}
            className={twMerge("", className)}>
            { icon }
            { children && <p className="flex-1">{children}</p> }
        </button>
    );
}
