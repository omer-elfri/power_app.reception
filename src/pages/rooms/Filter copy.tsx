import { twMerge } from "tailwind-merge";
import { room_ctg_list, room_list } from "../../datas/types";
import BedRoom from "../../types/bedroom";
import { GiHamburgerMenu } from "react-icons/gi";
import { FiGrid } from "react-icons/fi";

export default function FilterSection({ form, setForm, className }: {
    form: 'line' | 'grid',
    setForm: React.Dispatch<React.SetStateAction<'line' | 'grid'>>,
    className?: string,
}) {
    // let res = room_list.map(stage => stage.categories.map((ctg) => (ctg.id)));
    // let stages = [...new Set(res)];

    let roomCtgs: BedRoom.Category.Id[] = [];

    room_list.forEach((room) => {
        roomCtgs = [...roomCtgs, ...room.categories];
    })

    let floorTab: BedRoom.Stage.Id[] = room_list
        .map((room) => (room.stage))
        .sort((stageA, stageB) => (parseInt(stageA) - parseInt(stageB)));
    const floorList = [...new Set(floorTab)];

    return (
        <div className={twMerge("flex flex-row gap-3", className)}>

            <input type="search" placeholder="Rechercher" className="flex-1 border-1 text-[11px] font-bold flex-1 rounded-md py-2 px-3" /> 

            <select name="stage" className="border-1 text-[11px] font-bold py-2">
                <option value="all">Tous les étages</option>
                { floorList.map((stageId) => (
                    <option key={stageId} value={stageId}>
                        {BedRoom.Stage.stages[stageId as BedRoom.Stage.Id].name}
                    </option>
                )) }
            </select>

            <select name="category" className="border-1 text-[11px] font-bold py-2">
                <option value="all">Tous les catégories</option>
                { room_ctg_list.map((roomCtg) => (
                    <option key={roomCtg.id} value={roomCtg.id}>{roomCtg.name}</option>
                )) }
            </select>

            <select name="status" className="border-1 text-[11px] font-bold py-2">
                <option value="all">Tous les états</option>
            </select>

            <div className="flex flex-row gap-x-1">
                <button className={twMerge("", (form==="line")?"text-white bg-green-600":"bg-gray-300/50")} onClick={() => setForm('line')}> <GiHamburgerMenu /> </button>
                <button className={twMerge("", (form==="grid")?"text-white bg-blue-600":"bg-gray-300/50")} onClick={() => setForm('grid')}> <FiGrid /> </button>
            </div>


        </div>
    );
}
