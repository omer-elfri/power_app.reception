import { PageMain } from "../../App";
import { PageId } from "../../datas/type";

export default function GlobalPage({ switchPage }: {
    switchPage: (pageId: PageId) => void
}) {
  return (
    <PageMain>
      <div className="flex flex-row justify-between items-center p-5">
        <h1 className="text-3xl font-bold">Global Page</h1>
        <button onClick={() => switchPage("ROOMS")}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >Go to Rooms Page</button>
      </div>
    </PageMain>
  );
}

