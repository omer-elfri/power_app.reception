import React from "react";
import { twMerge } from "tailwind-merge";
import { useDataContext } from "./hooks";

import { MdWarning } from "react-icons/md";
import { FaCheckCircle } from "react-icons/fa";

export default function Alert({ className }: {
  className?: string,
}) {
  const { alert, setAlert } = useDataContext();

  React.useEffect(() => {
      if (!alert) return;
      const id = setTimeout(() => setAlert(null), 5*1000);
      return () => clearTimeout(id);
  }, [alert]);

  if (!alert) return null;
  
  return (
    <div className={twMerge("fixed grid grid-cols-[auto_1fr] items-center gap-3 top-5 z-110 \
        px-5 py-3 max-w-[80vw] text-center rounded text-[12px] font-bold flex-1",
      alert[0] === 'success' ? "bg-white/80 text-green-800" :
      alert[0] === 'error' ? "bg-white/80 text-red-800" : "", className)}>
        { alert[0] === 'success' && <FaCheckCircle size={30} className="" /> }
        { alert[0] === 'error' && <MdWarning size={30} className="" /> }
        <span>{alert[1]}</span>
    </div>
  );
}

