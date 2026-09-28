import { IoPersonSharp }  from "react-icons/io5";
import { GoArrowUpRight, GoArrowDownRight }  from "react-icons/go";

export function CheckinIcon() {
  return (
    <div className="flex flex-row">
      <IoPersonSharp size={25} />
      <GoArrowUpRight className="ml-[-8px] " />
    </div>
  );
}

export function CheckoutIcon() {
  return (
    <div className="flex flex-row">
      <IoPersonSharp size={25} />
      <GoArrowDownRight className="ml-[-8px] " />
    </div>
  );
}
