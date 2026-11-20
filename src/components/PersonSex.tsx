import { twMerge } from "tailwind-merge";

import { Sex } from "../types";
import { MdPerson, MdPerson3 } from "react-icons/md";

export function PersonSex2({ sexe, size, color, className, children }: {
    sexe?: Sex,
    size?: number,
    color?: string,
    className?: string,
    children?: React.ReactNode,
}) {
    const icon = (sexe === 'Mme'
        ? <MdPerson3 size={size} color={color} />
        : <MdPerson size={size} color={color} /> );
    return <div className={twMerge("flex flex-row gap-3 items-center", className)}>
        { icon } { children }
    </div>
}
