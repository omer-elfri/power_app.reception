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
import { useDataContext } from "../../hooks";

export default function GlobalPage() {
  const { moves, notifications, restaurations } = useDataContext();

  return (
    <div className="flex flex-col gap-3 pb-5">

      <PageTitle />

      <div className="grid grid-cols-10 grid-rows-[auto_370px_250px] gap-5">

        <SectionBox className="col-span-10">
          <Title icon={<FaRegCalendarAlt size={20} className="" />}>Activités du jour</Title>
          <ActivitySection />
        </SectionBox>

        <SectionBox className="col-span-3" bottom={<SeeMore value="Plus de détails" />}>
          <Title>Analyse</Title>
          <AnalyseSection />
        </SectionBox>

        <SectionBox className="col-span-4"
            bottom={<SeeMore value="Voir plus" />}>
          <Title className="mb-3" icon={<TbArrowsDoubleNeSw size={20} />}>Mouvements du jour</Title>
          <MouvementSection />
        </SectionBox>

        <SectionBox className="col-span-3 row-span-2"
            bottom={<SeeMore value="Voir tout" />}>
          <Title right={notifications.length}
            icon={<IoMdNotificationsOutline size={20} className="" />}>Notifications</Title>
          <NotificationSection />
        </SectionBox>

        <SectionBox className="col-span-7"
            bottom={<SeeMore value="Voir tout" />}>
          <Title right={restaurations.length} icon={<RiServiceBellLine size={22} className="" />}>Restauration</Title>
          <RestaurationSection />
        </SectionBox>

      </div>

    </div>
  );
}
