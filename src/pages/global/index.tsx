import PageTitle from "../../components/PageTitle";

import ActivitySection from "./Activities";
import AnalyseSection from "./Analyse";
import MouvementSection from "./Mouvements";
import EntretienSection from "./Entretien";
import RestaurationSection from "./Restauration";

export default function GlobalPage() {
  return (
    <div className="flex flex-col gap-1 pb-5">

      <PageTitle />

      <div className="grid grid-cols-10 grid-rows-[auto_auto_minmax(230px,1fr)] gap-5">
        <ActivitySection className="col-span-10" />
        <AnalyseSection className="col-span-3" />
        <MouvementSection className="col-span-4" />
        <EntretienSection className="col-span-3 row-span-2" />
        <RestaurationSection className="col-span-7" />
      </div>

    </div>
  );
}
