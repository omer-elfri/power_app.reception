'use client'

import React from "react";
import LogIn from "./login";

export default function LoginPage() {
  return (
    <div style={{ backgroundImage: "url('/rue marina.jpg')" }} className="bg-no-repeat bg-center bg-cover bg-white absolute inset-0 z-100">
      <div className="flex justify-center items-center gap-5 w-full h-full bg-black/70 backdrop-blur-sm">
        <LogIn />
      </div>
    </div>
  );
}

export function MyInput({ label, name, icon, children }: {
  label: string,
  name?: string,
  icon: React.ReactNode,
  children: React.ReactNode,
}) {
  return (
    <div className="flex flex-col gap-2">

      <label htmlFor={name}>{label}</label>

      <div className="grid grid-cols-[16px_auto_1fr] items-center gap-3 border-1 !border-gray-400 \
        shadow-[inset_0_2px_4px_rgba(0,0,0,0.15)] px-2 py-1 rounded">

        {icon} <div className="border-l-1 border-gray-400 h-4" />

        <div className="flex flex-row items-center gap-3">
          { children }
        </div>

      </div>

    </div>
  );
}

