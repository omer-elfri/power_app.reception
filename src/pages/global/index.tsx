"use client"

import BedRoom from "../../types/bedroom";

import { FaRegCalendarAlt }  from "react-icons/fa";
import { IoMdNotificationsOutline } from "react-icons/io";
import { TbArrowsDoubleNeSw }  from "react-icons/tb";
import { RiServiceBellLine }  from "react-icons/ri";

import PageTitle from "../../components/PageTitle";
import SectionBox from "../../components/SectionBox";
import ActivitySection from "./Activities";
import AnalyseSection from "./Analyse";
import NotificationSection from "./Notifications";
import MouvementSection from "./Mouvements";
import RestaurationSection from "./Restauration";
import Status from "../../types/status";

export default function GlobalPage() {

  // const rooms = [
  //   {
  //     roomId: '101',
  //     status: {
  //       type: 'sold',
  //       start: "",
  //       nuitee: 3,
  //     },
  //     cleaning: {
  //       vallet: 'Alberick',
  //     },
  //     booked: [
  //       {
  //         client: "",
  //         start: "",
  //         end: "",
  //       }
  //     ],
  //     comment: "",
  //     hs: true,

  //     powered: true,
  //     breakfast: true,
  //   }
  // ]

  const room_infos = {
    'sold': 8,
    'coming': 7,
    'hs': 2,
    'cleaning': {
      'check_out': 1,
      'check_in': 2,
    },
    'powered': 0,
    'breakfast': 40,
    'going': 5,
  };

  const moves: {
    'come_at': string,
    'roomId': BedRoom.Id,
    'sens': 'arrivée' | 'départ',
    'client': string,
    'go_at': string,
  }[] = [{
    'sens': "arrivée",
    'roomId': '101',
    'client': "Mr Smith",
    'come_at': "11:00",
    'go_at': "11:30",
  }, {
    'sens': "départ",
    'roomId': '104',
    'client': "Mme Charlotte",
    'come_at': "12:00",
    'go_at': "13:00",
  }, {
    'sens': "arrivée",
    'roomId': '101',
    'client': "Mr Smith",
    'come_at': "11:00",
    'go_at': "11:30",
  }, {
    'sens': "départ",
    'roomId': '104',
    'client': "Mme Charlotte",
    'come_at': "12:00",
    'go_at': "13:00",
  }, {
    'sens': "arrivée",
    'roomId': '101',
    'client': "Mr Smith",
    'come_at': "11:00",
    'go_at': "11:30",
  }, {
    'sens': "départ",
    'roomId': '104',
    'client': "Mme Charlotte",
    'come_at': "12:00",
    'go_at': "13:00",
  }, {
    'sens': "arrivée",
    'roomId': '101',
    'client': "Mr Smith",
    'come_at': "11:00",
    'go_at': "11:30",
  }, {
    'sens': "départ",
    'roomId': '104',
    'client': "Mme Charlotte",
    'come_at': "12:00",
    'go_at': "13:00",
  }, {
    'sens': "arrivée",
    'roomId': '101',
    'client': "Mr Smith",
    'come_at': "11:00",
    'go_at': "11:30",
  }, {
    'sens': "départ",
    'roomId': '104',
    'client': "Mme Charlotte",
    'come_at': "12:00",
    'go_at': "13:00",
  }, {
    'sens': "arrivée",
    'roomId': '101',
    'client': "Mr Smith",
    'come_at': "11:00",
    'go_at': "11:30",
  }, {
    'sens': "départ",
    'roomId': '104',
    'client': "Mme Charlotte",
    'come_at': "12:00",
    'go_at': "13:00",
  }, {
    'sens': "arrivée",
    'roomId': '101',
    'client': "Mr Smith",
    'come_at': "11:00",
    'go_at': "11:30",
  }, {
    'sens': "départ",
    'roomId': '104',
    'client': "Mme Charlotte",
    'come_at': "12:00",
    'go_at': "13:00",
  }, {
    'sens': "arrivée",
    'roomId': '101',
    'client': "Mr Smith",
    'come_at': "11:00",
    'go_at': "11:30",
  }, {
    'sens': "départ",
    'roomId': '104',
    'client': "Mme Charlotte",
    'come_at': "12:00",
    'go_at': "13:00",
  }, {
    'sens': "arrivée",
    'roomId': '101',
    'client': "Mr Smith",
    'come_at': "11:00",
    'go_at': "11:30",
  }, {
    'sens': "départ",
    'roomId': '104',
    'client': "Mme Charlotte",
    'come_at': "12:00",
    'go_at': "13:00",
  }];

  const notifications: {
    'time': string,
    'roomId': BedRoom.Id,
    'label': Status.Id,
    'value': string,
  }[] = [{
    'time': "11:00",
    'roomId': '101',
    'label': 'booked',
    'value': "Lorem ipsum dolor sit amet consectetur.",
  }, {
    'time': "13:00",
    'roomId': '101',
    'label': 'sold',
    'value': "Lorem ipsum dolor sit amet consectetur.",
  }, {
    'time': "12:00",
    'roomId': '101',
    'label': 'restaurant',
    'value': "Lorem ipsum dolor sit amet consectetur.",
  }, {
    'time': "13:00",
    'roomId': '101',
    'label': 'sold',
    'value': "Lorem ipsum dolor sit amet consectetur.",
  }, {
    'time': "12:00",
    'roomId': '101',
    'label': 'restaurant',
    'value': "Lorem ipsum dolor sit amet consectetur.",
  }, {
    'time': "13:00",
    'roomId': '101',
    'label': 'sold',
    'value': "Lorem ipsum dolor sit amet consectetur.",
  }, {
    'time': "12:00",
    'roomId': '101',
    'label': 'restaurant',
    'value': "Lorem ipsum dolor sit amet consectetur.",
  }, {
    'time': "13:00",
    'roomId': '101',
    'label': 'sold',
    'value': "Lorem ipsum dolor sit amet consectetur.",
  }, {
    'time': "12:00",
    'roomId': '101',
    'label': 'restaurant',
    'value': "Lorem ipsum dolor sit amet consectetur.",
  }, {
    'time': "13:00",
    'roomId': '101',
    'label': 'sold',
    'value': "Lorem ipsum dolor sit amet consectetur.",
  }, {
    'time': "12:00",
    'roomId': '101',
    'label': 'restaurant',
    'value': "Lorem ipsum dolor sit amet consectetur.",
  }, {
    'time': "13:00",
    'roomId': '101',
    'label': 'sold',
    'value': "Lorem ipsum dolor sit amet consectetur.",
  }, {
    'time': "12:00",
    'roomId': '101',
    'label': 'restaurant',
    'value': "Lorem ipsum dolor sit amet consectetur.",
  }, {
    'time': "13:00",
    'roomId': '101',
    'label': 'sold',
    'value': "Lorem ipsum dolor sit amet consectetur.",
  }, {
    'time': "12:00",
    'roomId': '101',
    'label': 'restaurant',
    'value': "Lorem ipsum dolor sit amet consectetur.",
  }, {
    'time': "13:00",
    'roomId': '101',
    'label': 'sold',
    'value': "Lorem ipsum dolor sit amet consectetur.",
  }, {
    'time': "12:00",
    'roomId': '101',
    'label': 'restaurant',
    'value': "Lorem ipsum dolor sit amet consectetur.",
  }, {
    'time': "13:00",
    'roomId': '101',
    'label': 'sold',
    'value': "Lorem ipsum dolor sit amet consectetur.",
  }, {
    'time': "12:00",
    'roomId': '101',
    'label': 'restaurant',
    'value': "Lorem ipsum dolor sit amet consectetur.",
  }, {
    'time': "13:00",
    'roomId': '101',
    'label': 'sold',
    'value': "Lorem ipsum dolor sit amet consectetur.",
  }, {
    'time': "12:00",
    'roomId': '101',
    'label': 'restaurant',
    'value': "Lorem ipsum dolor sit amet consectetur.",
  }];

  const restaurant: {
    'time': string,
    'roomId': BedRoom.Id,
    'client': string,
    'article': string,
    'price': number,
  }[] = [{
    'time': '10:15',
    'roomId': '101',
    'client': "Client 1",
    'article': "fwesd",
    'price': 20300,
  }, {
    'time': '10:15',
    'roomId': '102',
    'client': "Client 1",
    'article': "fwesd",
    'price': 20300,
  }, {
    'time': '10:15',
    'roomId': '101',
    'client': "Client 1",
    'article': "fwesd",
    'price': 20300,
  }];

  return (
    <div className="flex flex-col gap-3 pb-5">

      <PageTitle />

      <div className="grid grid-cols-10 grid-rows-[auto_400px_220px] gap-5">

        <SectionBox title="Activités du jour" icon={<FaRegCalendarAlt size={20} className="" />} className="col-span-10">
          <ActivitySection infos={room_infos} />
        </SectionBox>

        <SectionBox title="Analyse" className="col-span-3"
          more={{link:"", value:"Voir toutes les notifications"}}>
          <AnalyseSection infos={room_infos} />
        </SectionBox>

        <SectionBox icon={<TbArrowsDoubleNeSw size={20} />} title="Mouvements du jour" className="col-span-4" notif="1"
          more={{link:"", value:"Voir toutes les notifications"}}>
          <MouvementSection datas={moves} />
        </SectionBox>

        <SectionBox icon={<IoMdNotificationsOutline size={20} className="" />}
          title="Notifications" className="col-span-3 row-span-2" notif="1"
          more={{link:"", value:"Voir tout"}}>
          <NotificationSection datas={notifications} />
        </SectionBox>

        <SectionBox icon={<RiServiceBellLine size={22} className="" />}
          title="Restauration" className="col-span-7" notif="1"
          more={{link:"", value:"Voir tout"}}>
          <RestaurationSection datas={restaurant} />
        </SectionBox>

      </div>

    </div>
  );
}
