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
  const { bedRoomTab } = useBedroom();
  const { obsoletRooms, setPopup } = useDataContext();

  const analysis = React.useMemo(() => ({
    powered: bedRoomTab.filter(room => room.power),
    solded: bedRoomTab.filter(room => !!room.customer),
    free: bedRoomTab.filter(room => !room.customer),
    coming_total: bedRoomTab.filter(room => room.booked),
    issues: bedRoomTab.filter(room => room.issue),
    cleaning_total: bedRoomTab.filter(room => room.cleaner),
  }), [bedRoomTab]);

  return (
    <div className="flex flex-row items-center gap-1">
      <ActivityBox
        icon={<ImPower size={30} />}
        value={analysis.powered.length}
        name="Chambres" subName="alimentées"
        color={colors.powered}
        // onClick={() => setStatus(['powered'])}
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
        onClick={() =>  setPopup(['LIST', 'sold'])}
      />
      <ActivityBox
        icon={<IoBed size={35} />}
        value={analysis.free.length}
        name="Chambres" subName="disponibles"
        color={colors.free}
        onClick={() =>  setPopup(['LIST', 'free'])}
      />
      <ActivityBox
        icon={<FaCalendarAlt size={30} />}
        value={analysis.coming_total.length}
        name="Réservations" subName="aujourd'hui"
        color={colors.coming}
        onClick={() =>  setPopup(['BOOKING'])}
      />
      <ActivityBox
        icon={<MdCleaningServices size={30} />}
        value={analysis.cleaning_total.length}
        name="Chambre" subName="en néttoyage"
        color={colors.cleaning}
        onClick={() =>  setPopup(['CLEAN'])}
        infobulle={obsoletRooms.length > 0 && <MdWarning
          title="Certaines chambres sont obsolètes"
          className="text-yellow-600" />}
      />
      <ActivityBox bar={false}
        icon={<FaTools size={30} />}
        value={analysis.issues.length}
        name="Pannes" subName="signalées"
        color={colors.issue}
        onClick={() =>  setPopup(['LIST', 'issue'])}
      />
    </div>
  );
}
