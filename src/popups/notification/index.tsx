'use client';

import Popup, { PopupBody } from "..";
import { useDataContext } from "../../hooks";

import MyButton from "../../components/MyButton";
import { Title } from "../../components/SectionBox";

import { ImCross } from "react-icons/im";
import { IoMdNotificationsOutline } from "react-icons/io";
import { getTime } from "../../tools";
import { colors } from "../../types";
import { twMerge } from "tailwind-merge";
import { getNotification } from "../../tools/notifications";

export default function NotificationPopup() {
  const { notificationBook, setNotificationPopup, obsoletRooms } = useDataContext();

  const title = (
    <Title bar
      icon={<IoMdNotificationsOutline size={20} className="" />}
      right={<MyButton
        name="close" icon={<ImCross size={10} />}
        className="bg-red-700/10 text-[11px] text-red-700 p-2 rounded"
        onClick={() => setNotificationPopup(false)}
      />}
    > <span>Notifications</span>
    </Title>
  );

  return (
    <Popup onClose={() => setNotificationPopup(false)}>
      <PopupBody top={title} className="gap-3">

        <table className="text-center">

          <thead className="text-[12px] font-bold">
            <tr>
              <td>Date</td>
              <td>Statut</td>
              <td>Chambre</td>
              <td>Message</td>
              <td>Description</td>
            </tr>
          </thead>

          <tbody className="text-[12px]">
            { notificationBook.slice(0,20).map((notif, i) => (
              <tr key={notif.id} className={twMerge("[&>td]:py-1 [&>td]:px-2", i%2===0 ? "bg-gray-300" : "")}>
                <td>{getTime(notif.date)}</td>
                <td className="flex flex-row justify-center">
                  <p className="text-[9px] font-bold py-[2px] px-[5px] rounded"
                    style={{ backgroundColor: colors[notif.label]+"20", color: colors[notif.label] }}>{notif.label}
                  </p>
                </td>
                <td>{notif.roomId}</td>
                <td className="text-start">{getNotification(notif)}</td>
                <td>{notif.description}</td>
              </tr>
            )) }
          </tbody>

        </table>

      </PopupBody>
    </Popup>
  );
}
