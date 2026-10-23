import PageTitle from "../../components/PageTitle";
import SectionBox, { SeeMore, Title } from "../../components/SectionBox";
import { useDataContext } from "../../hooks";

import ActivitySection from "./Activities";
import AnalyseSection from "./Analyse";
import MouvementSection from "./Mouvements";
import EntretienSection from "./Entretien";
import RestaurationSection from "./Restauration";

import { FaRegCalendarAlt }  from "react-icons/fa";
import { TbArrowsDoubleNeSw }  from "react-icons/tb";
import { RiServiceBellLine }  from "react-icons/ri";
import { MdOutlineCleaningServices } from "react-icons/md";

export default function GlobalPage() {
  const { cleaning_book, addPopup, restaurant, } = useDataContext();

  const today = new Date(Date.now());
  const todayCleaning = cleaning_book.get.filter(
    clean => !clean.done ||
      clean.date.getDate() === today.getDate() ||
      clean.done?.getDate() === today.getDate()
  ).slice(0,15);

  return (
    <div className="flex flex-col gap-1 pb-5">

      <PageTitle />

      <div className="grid grid-cols-10 grid-rows-[auto_auto_minmax(230px,1fr)] gap-5">

        <SectionBox className="col-span-10">
          <Title icon={<FaRegCalendarAlt size={20} />}>Activités du jour</Title>
          <ActivitySection />
        </SectionBox>

        <SectionBox className="col-span-3">
          <Title>Analyse</Title>
          <AnalyseSection />
        </SectionBox>

        <SectionBox className="col-span-4">
          <Title icon={<TbArrowsDoubleNeSw size={20} />} className="mb-3">Mouvements du jour</Title>
          <MouvementSection />
        </SectionBox>

        <SectionBox className="col-span-3 row-span-2 max-h-[650px]"
            bottom={<SeeMore value="Voir tout" onClick={() => addPopup(['CLEAN'])} />}>
          <Title icon={<MdOutlineCleaningServices size={16} />} right={todayCleaning.length}>Entretiens</Title>
          <EntretienSection cleans={todayCleaning} />
        </SectionBox>

        <SectionBox className="col-span-7">
          <Title right={restaurant.length} icon={<RiServiceBellLine size={22} />}>Restauration</Title>
          <RestaurationSection />
        </SectionBox>

      </div>

    </div>
  );
}
