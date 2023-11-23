// import Card from "../components/card/card.tsx";
import { Outlet } from "react-router-dom";
import Navbar from "../components/navbar/navbar.tsx";
import "./root.scss";
export default function Root() {
  return (
    <>
      <Navbar></Navbar>
      <div className="page-container">
        <Outlet />
      </div>
    </>
  );
}
