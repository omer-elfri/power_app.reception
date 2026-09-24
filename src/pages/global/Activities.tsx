import React from "react";

import ActivityBox from "../../components/ActivityBox";
import { FaCoffee }  from "react-icons/fa";
import { IoPersonSharp }  from "react-icons/io5";
import { FaTools }  from "react-icons/fa";
import { MdCleaningServices }  from "react-icons/md";
import { GoArrowUpRight, GoArrowDownRight }  from "react-icons/go";
import { ImPower }  from "react-icons/im";

export default function ActivitySection({ infos }: {
  infos: {
    'powered': number,
    'coming': number,
    'going': number,
    'cleaning': {
      'check_in': number,
      'check_out': number,
    },
    'breakfast': number,
    'hs': number,
  },
}) {

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
      <ActivityBox icon={<ImPower size={30} />} value={infos.powered} text="Chambres alimentées" color="#300000" />
      <ActivityBox icon={<CheckinIcon />} value={infos.coming} text="Arrivées prévues" color="#800000" />
      <ActivityBox icon={<CheckoutIcon />} value={infos.going} text="Départ prévues" color="#008000" />
      <ActivityBox icon={<MdCleaningServices size={30} />} value={infos.cleaning.check_in + infos.cleaning.check_out} text="Chambre en néttoyage" color="#800000" />
      <ActivityBox icon={<FaCoffee size={32} />} value={infos.breakfast} text="Petit-déjeuner inclus" color="#000080" />
      <ActivityBox icon={<FaTools size={30} />} value={infos.hs} text="Pannes signalées" bar={false} color="#800000" />
    </div>
  );
}
