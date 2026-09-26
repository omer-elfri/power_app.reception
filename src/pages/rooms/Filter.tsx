import { bedroom_ctgs_datas } from "../../datas/room_ctg";

export default function FilterSection() {
    return (
        <div className="flex flex-row gap-3">
            <input type="search" className="border-1 text-[11px] font-bold flex-1 rounded-md py-2" /> 
            <select name="stage" className="border-1 text-[11px] font-bold py-2">
                <option value="all">Tous les étages</option>
                <option value="0">Rez de chaussée</option>
                <option value="1">Étages 1</option>
                <option value="2">Étages 2</option>
            </select>
            <select name="category" className="border-1 text-[11px] font-bold py-2">
                <option value="all">Tous les catégories</option>
                { bedroom_ctgs_datas.map((roomCtg) => (
                    <option key={roomCtg.id} value={roomCtg.id}>{roomCtg.name}</option>
                )) }
            </select>
            <select name="status" className="border-1 text-[11px] font-bold py-2">
                <option value="all">Tous les états</option>
            </select>
        </div>
    );
}
