// import Card from "../components/card/card.tsx";
import { Outlet } from "react-router-dom";
import Navbar from "../components/navbar/navbar.tsx";

export default function Root() {
  return (
    <>
      <Navbar></Navbar>
      <Outlet />
    </>
  );
}
