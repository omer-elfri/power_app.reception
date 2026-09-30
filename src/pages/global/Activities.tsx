'use client'

import React from "react";

import { useDataContext } from "../../datas/context";
import { colors } from "../../types";
import ActivityBox from "../../components/ActivityBox";

import { GoArrowUpRight }  from "react-icons/go";
import { IoBed, IoPersonSharp }  from "react-icons/io5";
import { FaTools, FaCalendarAlt }  from "react-icons/fa";
import { MdCleaningServices }  from "react-icons/md";
import { ImPower }  from "react-icons/im";

export default function ActivitySection() {
  const { analysis } = useDataContext();

  const CheckinIcon = React.useCallback(() => (
    <div className="flex flex-row">
      <IoPersonSharp size={30} />
      <GoArrowUpRight className="ml-[-8px] " />
    </div>
  ), []);

  return (
    <div className="flex flex-row items-center gap-1">
      <ActivityBox
        icon={<ImPower size={30} />}
        value={analysis.powered.length}
        name="Chambres" subName="alimentées"
        color={colors.powered}
      />
      <ActivityBox
        icon={<CheckinIcon />}
        value={analysis.solded.length}
        name="Chambres" subName="vendues"
        color={colors.sold}
      />
      <ActivityBox
        icon={<IoBed size={35} />}
        value={analysis.free.length}
        name="Chambres" subName="disponibles"
        color={colors.free}
      />
      <ActivityBox
        icon={<FaCalendarAlt size={30} />}
        value={analysis.coming.length}
        name="Réservations" subName="aujourd'hui"
        color={colors.coming}
      />
      <ActivityBox
        icon={<MdCleaningServices size={30} />}
        value={analysis.cleaning.total.length}
        name="Chambre" subName="en néttoyage"
        color={colors.cleaning}
      />
      <ActivityBox bar={false}
        icon={<FaTools size={30} />}
        value={analysis.issues.length}
        name="Pannes" subName="signalées"
        color={colors.issue}
      />
    </div>
  );
}
