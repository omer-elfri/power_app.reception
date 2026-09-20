import React from "react";
import "./App.css";
import { PageId } from "./datas/type";

import GlobalPage from "./pages/global";
import RoomsPage from "./pages/rooms";
import { twMerge } from "tailwind-merge";

export default function App() {
  const [page, setPage] = React.useState<PageId>("ROOMS");

  return (
    <div className="flex flex-col h-screen">
      { (page === "GLOBAL") ?
        <GlobalPage switchPage={setPage} /> :
      (page === "ROOMS") ?
        <RoomsPage switchPage={setPage} /> :
      null }
    </div>
  );
}

export function PageMain({ className, topClassName, children }: {
  topClassName?: string,
  className?: string,
  children: React.ReactNode,
}) {
  return (
    <div className={twMerge("flex flex-col items-center w-screen max-h-screen px-5 py-2 overflow-auto", topClassName)}>
      <div className={twMerge("flex flex-col w-full max-w-210", className)}>
          { children }
      </div>
    </div>
  );
}
