'use client'

import React from "react";

import { useDataContext } from "../../datas/context";
import ActivityBox from "../../components/ActivityBox";

import { IoBed, IoPersonSharp }  from "react-icons/io5";
import { FaTools, FaCalendarAlt }  from "react-icons/fa";
import { MdCleaningServices }  from "react-icons/md";
import { GoArrowUpRight, GoArrowDownRight }  from "react-icons/go";
import { ImPower }  from "react-icons/im";

export default function ActivitySection() {
  const { analysis } = useDataContext();

  const CheckinIcon = React.useCallback(() => (
    <div className="flex flex-row">
      <IoPersonSharp size={30} />
      <GoArrowUpRight className="ml-[-8px] " />
    </div>
  ), []);

  const CheckoutIcon = React.useCallback(() => (
    <div className="flex flex-row">
      <IoPersonSharp size={30} />
      <GoArrowDownRight className="ml-[-8px] " />
    </div>
  ), []);

  return (
    <div className="flex flex-row items-center gap-1">
      <ActivityBox
        icon={<ImPower size={30} />}
        value={analysis.nbPowered}
        name="Chambres" subName="alimentées"
        color="#cf0037"
      />
      <ActivityBox
        icon={<CheckinIcon />}
        value={analysis.nbSolded}
        name="Chambres" subName="vendues"
        color="#300000"
      />
      <ActivityBox
        icon={<IoBed size={35} />}
        value={analysis.nbFree}
        name="Chambres" subName="disponibles"
        color="#800000"
      />
      <ActivityBox
        icon={<FaCalendarAlt size={30} />}
        value={analysis.nbComing}
        name="Réservations" subName="aujourd'hui"
        color="#008000"
      />
      <ActivityBox
        icon={<MdCleaningServices size={30} />}
        value={analysis.nbCleaning.checkin + analysis.nbCleaning.checkout}
        name="Chambre" subName="en néttoyage"
        color="#000080"
      />
      <ActivityBox bar={false}
        icon={<FaTools size={30} />}
        value={analysis.nbHs}
        name="Pannes" subName="signalées"
        color="#aaa"
      />
    </div>
  );
}
