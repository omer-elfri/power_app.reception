'use client'

import { twMerge } from "tailwind-merge";
import { PiScreencastBold } from "react-icons/pi";
import { useVisual } from "../hooks/useVisual";
import { PopupType } from "../types";

export default function Caster({ value, color, className }: {
    value: PopupType,
    className?: string,
    color?: string,
}) {
    const { addPopup } = useVisual();

    return (
        <PiScreencastBold size={17} color={color}
            className={twMerge('cursor-pointer', className)}
            onClick={() => addPopup(value)}
        />
    );
}

