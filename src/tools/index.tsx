import { MdError, MdWarning } from "react-icons/md";
import { InfosType } from "../hooks/bedroom";
import BedRoom from "../types/bedroom";
import { room_ctg_datas } from "../configs/room_ctg";

export function uniqueId<T extends Record<string, any>>(
    tab: T[],
    key: keyof T = "id"
): T[] {
    const ids = tab.map(elem => elem[key]);

    if (ids.length !== new Set(ids).size)
        throw Error("Double id");
    return tab;
}

export function getTime(date: Date) {
    const now = Date.now();
    const day = 24 * 60 * 60 * 1000;
    const isOlderThanDay = now - date.getTime() >= day;
    return !isOlderThanDay ? getHour(date) : getDate(date);
}

export function getDate(date: Date) {
    const res = date.toLocaleDateString()
        .slice(0, 5);
    return res;
}

export function getHour(date: Date) {
    const res = date.toLocaleTimeString()
        .slice(0, 5);
    return res;
}

export function formatPrice(price: number) {
    let res = "";
    for (let tmp = price; tmp > 0; tmp = Math.trunc(tmp/1000)) {
        let a = tmp % 1000;
        let aStr = (a === 0) ? "000" : a.toString();
        res = (res === "") ? aStr : aStr + "." + res;
    }
    return res;
}





export function string_object<T>(key: string) {
    const stocked = localStorage.getItem(key);
    if (!stocked) return;

    const jsonDatas: T = JSON.parse(stocked, (key, value) => {
        if (typeof value === "string" &&
            /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?Z$/.test(value) )
            return new Date(value);
        return value;
    });
    return jsonDatas;
}


export function getInfos(datas: BedRoom.Type): InfosType {
    const powered = (datas.power) ? "Allumée" : (datas.power === false) ? "Éteinte" : "...";
    const isSolded = !!datas.client;

    const isDurt = (() => {
        if (datas.cleaning?.end) {
            const now = new Date(Date.now());
            const endDate = datas.cleaning.end;
            const oneDay = 60 * 60 * 24 * 1000;
            const res = endDate.getTime() - now.getTime() > oneDay * 3;
            return !res ? "Propre" : "Non";
        }
        return "...";
    })();
    const cleaning = datas.cleaning?.vallet.name ?? isDurt;

    const clientName = datas.client?.name ?? datas.coming?.rsv.client ?? null;
    const issueIcon =
        (datas.issue?.priority === 'high') ? 
            <MdError size={15} className="text-red-600" /> :
        (datas.issue?.priority === 'medium') ?
            <MdWarning size={15} className="text-yellow-600" /> :
        (datas.issue?.priority === 'low') ?
            <MdWarning size={15} className="text-yellow-600" /> :
        null;
    const categoryNames = datas.categories
        .map((ctgId) => ({ id: ctgId, ...room_ctg_datas[ctgId] }) )
        .map(({ name }) => name ).join(", ");
    return ({ powered, isSolded, cleaning, clientName, issueIcon, categoryNames });
}
