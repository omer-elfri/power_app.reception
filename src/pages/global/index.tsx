import PageTitle from "../../components/PageTitle";
import SectionBox, { SeeMore, Title } from "../../components/SectionBox";

import ActivitySection from "./Activities";
import AnalyseSection from "./Analyse";
import MouvementSection from "./Mouvements";
import NotificationSection from "./Notifications";
import RestaurationSection from "./Restauration";

import { FaRegCalendarAlt }  from "react-icons/fa";
import { IoMdNotificationsOutline } from "react-icons/io";
import { TbArrowsDoubleNeSw }  from "react-icons/tb";
import { RiServiceBellLine }  from "react-icons/ri";

export default function GlobalPage() {

  return (
    <div className="flex flex-col gap-3 pb-5">

      <PageTitle />

      <div className="grid grid-cols-10 grid-rows-[auto_400px_auto] gap-5">

        <SectionBox className="col-span-10">
          <Title name="Activités du jour"
            icon={<FaRegCalendarAlt size={20} className="" />} />
          <ActivitySection />
        </SectionBox>

        <SectionBox className="col-span-3"
            bottom={<SeeMore value="Plus de détails" />}>
          <Title name="Analyse" />
          <AnalyseSection />
        </SectionBox>

        <SectionBox className="col-span-4"
            bottom={<SeeMore value="Voir plus" />}>
          <Title name="Mouvements du jour" className="mb-3"
            icon={<TbArrowsDoubleNeSw size={20} />} />
          <MouvementSection />
        </SectionBox>

        <SectionBox className="col-span-3 row-span-2"
            bottom={<SeeMore value="Voir tout" />}>
          <Title name="Notifications" notif="1"
            icon={<IoMdNotificationsOutline size={20} className="" />} />
          <NotificationSection />
        </SectionBox>

        <SectionBox className="col-span-7"
            bottom={<SeeMore value="Voir tout" />}>
          <Title name="Restauration" notif="1"
            icon={<RiServiceBellLine size={22} className="" />} />
          <RestaurationSection />
        </SectionBox>

      </div>

    </div>
  );
}
