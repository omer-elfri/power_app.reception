'use client'

import React from "react";

import { useBedroom } from "../../hooks/useBedroom";
import { useDataContext } from "../../hooks";
import { colors } from "../../types";
import ActivityBox from "../../components/ActivityBox";

import { GoArrowUpRight }  from "react-icons/go";
import { IoBed, IoPersonSharp }  from "react-icons/io5";
import { FaTools, FaCalendarAlt }  from "react-icons/fa";
import { MdCleaningServices, MdWarning }  from "react-icons/md";
import { ImPower }  from "react-icons/im";

export default function ActivitySection() {
  const { analysis } = useBedroom();
  const { obsoletRooms, addPopup } = useDataContext();

  return (
    <div className="flex flex-row items-center gap-1">
      <ActivityBox
        icon={<ImPower size={30} />}
        value={analysis.powered.length}
        name="Chambres" subName="alimentées"
        color={colors.powered}
        onClick={() => addPopup(['LIST', 'powered'])}
      />
      <ActivityBox
        icon={ <div className="flex flex-row">
            <IoPersonSharp size={30} />
            <GoArrowUpRight className="ml-[-8px] " />
          </div>
        }
        value={analysis.solded.length}
        name="Chambres" subName="vendues"
        color={colors.sold}
        onClick={() =>  addPopup(['LIST', 'sold'])}
      />
      <ActivityBox
        icon={<IoBed size={35} />}
        value={analysis.free.length}
        name="Chambres" subName="disponibles"
        color={colors.free}
        onClick={() =>  addPopup(['LIST', 'free'])}
      />
      <ActivityBox
        icon={<FaCalendarAlt size={30} />}
        value={analysis.coming.total.length}
        name="Réservations" subName="aujourd'hui"
        color={colors.coming}
        onClick={() =>  addPopup(['BOOKING'])}
      />
      <ActivityBox
        icon={<MdCleaningServices size={30} />}
        value={analysis.cleaning.total.length}
        name="Chambre" subName="en néttoyage"
        color={colors.cleaning}
        onClick={() =>  addPopup(['LIST', 'clean'])}
        infobulle={obsoletRooms.length > 0 && <MdWarning
          title="Certaines chambres sont obsolètes"
          className="text-yellow-600" />}
      />
      <ActivityBox bar={false}
        icon={<FaTools size={30} />}
        value={analysis.issues.length}
        name="Pannes" subName="signalées"
        color={colors.issue}
        onClick={() =>  addPopup(['LIST', 'issue'])}
      />
    </div>
  );
}
