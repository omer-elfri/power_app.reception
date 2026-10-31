'use client'

import { twMerge } from "tailwind-merge";
import { useRequest } from "../../hooks/useRequest";
import { useDataContext } from "../../hooks";
import { colors } from "../../types";
import { getString } from "../../tools";

import SectionBox, { Title } from "../../components/SectionBox";
import ActivityBox from "../../components/ActivityBox";
import { GoArrowUpRight }  from "react-icons/go";
import { IoBed, IoPersonSharp }  from "react-icons/io5";
import { FaCalendarAlt, FaRegCalendarAlt }  from "react-icons/fa";
import { MdCleaningServices, MdWarning }  from "react-icons/md";
import { ImPower }  from "react-icons/im";
import { TbChefHatFilled } from "react-icons/tb";

export default function ActivitySection({ className }: {
  className?: string,
}) {
  const { addPopup } = useDataContext();
  const { analysis } = useRequest();

  return (
    <SectionBox className={twMerge("", className)}>
      <Title icon={<FaRegCalendarAlt size={20} />}>Activités du jour</Title>

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
          value={analysis.available.length}
          name="Chambres" subName="disponibles"
          color={colors.free}
          onClick={() =>  addPopup(['LIST', 'free'])}
          infobulle={analysis.issues.length > 0 && <MdWarning
            title={`${getString(analysis.issues.length)} chambre(s) sont problématiques`}
            className="text-yellow-600" />}
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
          infobulle={analysis.cleaning.obsolets.length > 0 && <MdWarning
            title="Certaines chambres sont obsolètes"
            className="text-yellow-600" />}
        />
        <ActivityBox bar={false}
          icon={<TbChefHatFilled size={30} />}
          value={analysis.restaurant.total.length}
          name="Restaurations" subName="impayées"
          color={colors.issue}
          onClick={() =>  addPopup(['LIST', 'issue'])}
        />
        {/* <ActivityBox bar={false}
          icon={<FaTools size={30} />}
          value={analysis.critics.length}
          name="Chambres" subName="critiques"
          color={colors.issue}
          onClick={() =>  addPopup(['LIST', 'issue'])}
        /> */}
      </div>

    </SectionBox>
  );
}
