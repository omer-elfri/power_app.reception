'use client';

import React from "react";
import Popup, { PopupBody } from ".";
import { Title } from "../components/SectionBox";
import LabelInput from "../components/LabelInput";

import { useDataContext } from "../hooks";
import { useReservation } from "../hooks/reservation";
import { useBedRoom } from "../hooks/bedroom";
import { getTime, getDate } from "../tools";

// import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
// import { LocalizationProvider } from '@mui/x-date-pickers-pro/LocalizationProvider';
// import { AdapterDayjs } from '@mui/x-date-pickers-pro/AdapterDayjs';
// import { DateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker';

export default function BookingPopup() {
  const { setBookingPopup } = useDataContext();
  const { reservations, daily, getStatus } = useReservation();
  const { bedRoomTab } = useBedRoom();

  // const getBookState = React.useCallback((reservation: ReservationType, room: ReservationRoomDetails) => {
  //   if (reservation.cancel)
  //     return "annulé" : rsv.cancel ? "dépassé" : rsv.cancel ? "en cours" : "a venir";
  //   return "";
  // }, []);

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
              {/* <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DemoContainer components={['DateRangePicker']}>
                  <DateRangePicker />
                </DemoContainer>
              </LocalizationProvider> */}

              {/* <DateRangePicker
    // defaultValue={[dayjs('2022-04-17'), dayjs('2022-04-21')]}
  /> */}

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


        <p>Aujourd'hui</p>
        <div>
          { (daily.length === 0) ? (
            <div className="h-full bg-gray-200">
              <p>Aucune réservations aujourhui</p>
            </div>
          ) : daily.map(rsv_room => (
            <div key={rsv_room.roomId} className="grid grid-cols-7">
              <p>{getTime(rsv_room.rsv.booker.date)}</p>
              <p>{rsv_room.rsv.client}</p>
              <p>{rsv_room.roomId}</p>
              <p>{getDate(rsv_room.start)}</p>
              <p>{getDate(rsv_room.end)}</p>
              <p>{getStatus(rsv_room.rsv, rsv_room)}</p>
              <button>annuler</button>
            </div>
          )) }
        </div>

        <p className="mt-5">Toutes</p>
        <div className="flex flex-col gap-y-4">
          { reservations
          .sort((a, b) => (a.booker.date.getTime() - b.booker.date.getTime()))
          .map((rsv, i) => (
            <div key={i} className="grid grid-cols-7">
              { rsv.rooms.map((rsv_room, n) => (
                <React.Fragment key={rsv_room.roomId}>
                  { (n === 0) && <>
                    <p className={`row-span-${rsv.rooms.length}`}>{getTime(rsv.booker.date)}</p>
                    <p className={`row-span-${rsv.rooms.length}`}>{rsv.client}</p>
                  </> }
                  <p>{rsv_room.roomId}</p>
                  <p>{getDate(rsv_room.start)}</p>
                  <p>{getDate(rsv_room.end)}</p>
                  <p>{getStatus(rsv, rsv_room)}</p>
                  <div className="flex flex-row gap-2">
                    { !rsv.cancel ?
                      <button>annuler</button> :
                      <p>{getTime(rsv.cancel.date)}</p>
                    }
                  </div>
                </React.Fragment>
              )) }
            </div>
          )) }
          {/* { reservations.map(rsv => (
            rsv.rooms.map((rsv_room, n) => (
              <div key={rsv_room.roomId} className="grid grid-cols-6">
                { (n === 0) && <>
                  <p className={`row-span-${rsv.rooms.length}`} style={{ rowSpan: rsv.rooms.length, }}>{getTime(rsv.booker.date)}</p>
                  <p className={`row-span-${rsv.rooms.length}`} style={{ rowSpan: rsv.rooms.length, }}>{rsv.client}</p>
                </> }
                <p>{rsv_room.roomId}</p>
                <p>{getDate(rsv_room.start)}</p>
                <p>{getDate(rsv_room.end)}</p>
                <p>{getStatus(rsv, rsv_room)}</p>
              </div>
            ))
          )) } */}
        </div>
        

      </PopupBody>
    </Popup>
  );
}
