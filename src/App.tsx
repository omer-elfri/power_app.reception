import "./App.css";
import React from "react";
import { PageId } from "./datas/type";
import GlobalPage from "./pages/global";
import RoomsPage from "./pages/rooms";

export default function App() {
  const [page, setPage] = React.useState<PageId>("ROOMS");

  return (
    (page === "GLOBAL") ?
      <GlobalPage switchPage={setPage} /> :
    (page === "ROOMS") ?
      <RoomsPage switchPage={setPage} /> :
    null
  );
}
