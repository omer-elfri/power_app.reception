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
  const { notificationBook, setNotificationPopup, restaurant } = useDataContext();

  return (
    <div className="flex flex-col gap-1 pb-5">

      <PageTitle />

      <div className="grid grid-cols-10 grid-rows-[auto_340px_minmax(230px,auto)] gap-5">

        <SectionBox className="col-span-10">
          <Title icon={<FaRegCalendarAlt size={20} />}>Activités du jour</Title>
          <ActivitySection />
        </SectionBox>

        <SectionBox className="col-span-3">
          <Title>Analyse</Title>
          <AnalyseSection />
        </SectionBox>

        <SectionBox className="col-span-4">
          <Title icon={<TbArrowsDoubleNeSw size={20} />}
            className="mb-3">Mouvements du jour</Title>
          <MouvementSection />
        </SectionBox>

        <SectionBox className="col-span-3 row-span-2"
            bottom={<SeeMore value="Voir tout" onClick={() => setNotificationPopup(true)} />}>
          <Title icon={<IoMdNotificationsOutline size={20} />}
            right={notificationBook.length}>Notifications</Title>
          <NotificationSection />
        </SectionBox>

        <SectionBox className="col-span-7">
          <Title right={restaurant.length}
            icon={<RiServiceBellLine size={22} />}>Restauration</Title>
          <RestaurationSection />
        </SectionBox>

      </div>

    </div>
  );
}
