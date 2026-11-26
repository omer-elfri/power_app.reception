'use client';

import React from "react";
import { twMerge } from "tailwind-merge";

import { useRequest } from "../../../hooks/useRequest";
import BedRoom from '../../../types/bedroom';

import MyButton from "../../../components/MyButton";
import { FaCheck } from "react-icons/fa";

export default function CustomerForm({ roomId:bedRoomId, className, children }: {
  roomId: BedRoom.Id,
  className?: string,
  children?: React.ReactNode,
}) {
  const { check_in } = useRequest();

  const submitHandler = (e: React.SubmitEvent<HTMLFormElement>) => {
    const sexe = e.target.sexe.value;
    const fullname = e.target.fullname.value;
    const tel = e.target.tel.value;
    const town = e.target.town.value;
    const reason = e.target.reason.value;
    const price = e.target.price.value;
    check_in(bedRoomId, { sexe, name: fullname, tel, town, reason, price });
  }

  return (
    <form className={twMerge("flex flex-col gap-3 h-full \
    [&_label]:text-gray-600", className)} onSubmit={submitHandler}>
      { children }
      <MyButton name="check_in" iconRight={<FaCheck />}
        className="bg-blue-500 !py-1 text-white self-end">Check in
      </MyButton>
    </form>
  );
}

