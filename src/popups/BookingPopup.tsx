'use client';

import Popup, { PopupBody } from ".";
import { Title } from "../components/SectionBox";
import LabelInput from "../components/LabelInput";

import { useDataContext } from "../hooks";
import { useBedroom } from "../hooks/useBedroom";

export default function BookingPopup() {
  const { setBookingPopup } = useDataContext();
  const { bedRoomTab } = useBedroom();
  // const daily = getStates(['doing']);

  return (
    <Popup onClose={() => setBookingPopup(false)}>
      <PopupBody top={<Title bar>Réservation</Title>}>

        <form className="flex flex-col gap-3 my-5">

          <LabelInput label="Client" name="client" />

          { [0,0].map((_, i, tab) => (
            <div key={i} className="grid grid-cols-4 gap-2">
              <LabelInput label="Chambre" name="roomId" options={
                bedRoomTab.map(room => ({ k: room.id, value: room.id, }) )}
              />
              <input type="text" name="client" />
              <input type="text" name="client" />

              <div className="flex flex-row gap-3">
                { tab.length > 1 && <button>supprimer</button> }
                <button>ajouter</button>
              </div>
            </div>
          )) }

          <LabelInput label="Description">
            <textarea name="description" className="w-full">
            </textarea>
          </LabelInput>

          <button type="submit" name="register">Enrégistrer</button>

        </form>


        {/* <p>Aujourd'hui</p>
        <div>
          { (daily.length === 0) ? (
            <div className="h-full bg-gray-200">
              <p>Aucune réservations aujourhui</p>
            </div>
          ) : daily.map(rsv_room => (
            <div key={rsv_room.roomId} className="grid grid-cols-7">
              <p>{getTime(rsv_room.date)}</p>
              <p>{rsv_room.clientName}</p>
              <p>{rsv_room.roomId}</p>
              <p>{getDate(rsv_room.start)}</p>
              <p>{getDate(rsv_room.end)}</p>
              <p>{getBookedStatus(rsv_room)}</p>
              <button>annuler</button>
            </div>
          )) }
        </div>

        <p>Toutes</p>
        <div className="grid grid-cols-6 gap-y-4">
          { reservationBook.map((rsv_room, n) => (
            <React.Fragment key={n}>
              <p>{getTime(rsv_room.date)}</p>
              <p>{rsv_room.roomId}</p>
              <p>{getDate(rsv_room.start)}</p>
              <p>{getDate(rsv_room.end)}</p>
              <p>{getBookedStatus(rsv_room)}</p>
              <div className="flex flex-row gap-2">
                { (getBookedStatus(rsv_room) === 'coming' ||
                  getBookedStatus(rsv_room) === 'doing')
                  && <button>annuler</button> }
              </div>
            </React.Fragment>
          )) }
        </div> */}
        

      </PopupBody>
    </Popup>
  );
}
