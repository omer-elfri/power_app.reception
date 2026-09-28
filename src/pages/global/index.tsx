import BedRoom from "../../types/bedroom";

import { FaRegCalendarAlt }  from "react-icons/fa";
import { IoMdNotificationsOutline } from "react-icons/io";
import { TbArrowsDoubleNeSw }  from "react-icons/tb";
import { RiServiceBellLine }  from "react-icons/ri";

import PageTitle from "../../components/PageTitle";
import SectionBox, { Title } from "../../components/SectionBox";

import ActivitySection from "./Activities";
import AnalyseSection from "./Analyse";
import NotificationSection from "./Notifications";
import MouvementSection from "./Mouvements";
import RestaurationSection from "./Restauration";

export default function GlobalPage() {

  return (
    <div className="flex flex-col gap-3 pb-5">

      <PageTitle />

      <div className="grid grid-cols-10 grid-rows-[auto_400px_220px] gap-5">

        <SectionBox className="col-span-10">
          <Title name="Activités du jour" icon={<FaRegCalendarAlt size={20} className="" />} />
          <ActivitySection />
        </SectionBox>

        <SectionBox className="col-span-3" more={{link:"", value:"Plus de détails"}}>
          <Title name="Analyse" />
          <AnalyseSection />
        </SectionBox>

        <SectionBox className="col-span-4" more={{link:"", value:"Voir plus"}}>
          <Title name="Mouvements du jour" icon={<TbArrowsDoubleNeSw size={20} />} className="mb-3" />
          <MouvementSection />
        </SectionBox>

        <SectionBox className="col-span-3 row-span-2" more={{link:"", value:"Voir tout"}}>
          <Title name="Notifications" icon={<IoMdNotificationsOutline size={20} className="" />} notif="1" />
          <NotificationSection />
        </SectionBox>

        <SectionBox className="col-span-7" more={{link:"", value:"Voir tout"}}>
          <Title name="Restauration" icon={<RiServiceBellLine size={22} className="" />} notif="1" />
          <RestaurationSection />
        </SectionBox>

      </div>

    </div>
  );
}
