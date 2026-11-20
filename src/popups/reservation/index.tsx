'use client';

import React from "react";
import { twMerge } from "tailwind-merge";
import { DateRange } from "@daypicker/react";

import ItemPopup from "../items";
import BookingForm from "./form";
import BookingInfos from "./table";

export default function ReservationTab({ className }: {
  className?: string,
}) {
  const [selectedDate, setSelectedDate] = React.useState<DateRange>({ from: new Date() });

  return (
    <ItemPopup onglet="RESERVATION" className={twMerge("", className)}
      subClassName={twMerge("grid grid-cols-[230px_1fr] gap-3", )}>
      
      <BookingForm
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
      />
      <BookingInfos />

    </ItemPopup>
  );
}

