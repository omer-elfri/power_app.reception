import React from "react";
import { twMerge } from "tailwind-merge";
import { useNavigate } from "react-router-dom";

export default function MyLink({ href, className, children }: {
    href: string,
    className?: string,
    children?: React.ReactNode,
}) {
    const navigate = useNavigate();
    return (
        <div className={twMerge("cursor-pointer", className)}
            onClick={() => navigate(href)}>
            { children }
        </div>
    );
}
