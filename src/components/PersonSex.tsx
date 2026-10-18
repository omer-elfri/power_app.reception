import { twMerge } from "tailwind-merge";

import { Sex } from "../types";
import { MdPerson, MdPerson3 } from "react-icons/md";

export function PersonSex2({ sexe, size, className, children }: {
    sexe?: Sex,
    size?: number,
    className?: string,
    children?: React.ReactNode,
}) {
    const icon = (sexe === 'Mme'
        ? <MdPerson3 size={size} />
        : <MdPerson size={size} /> );
    return <div className={twMerge("flex flex-row gap-3 items-center", className)}>
        { icon } { children }
    </div>
}
