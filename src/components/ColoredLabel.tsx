import React from "react";

export default function ColoredLabel({ color, children }: {
    color: string,
    children: string | React.ReactNode,
}) {
    return (
        <div className={`px-2 py-1 text-[11px] font-bold border-1 rounded-md`}
            style={{ color, borderColor: color }}
        >{children}</div>
    );
}
