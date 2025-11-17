import { Outlet } from "react-router-dom";
import { ReactNode } from "react";


import Sidenav from "./Sidenav";
import Dbnav from "./Dbnav";
type ApplayoutProps = {
  children?: ReactNode;
};
export default function Applayout({ children }: ApplayoutProps) {
  return (
    <main className="flex">
      <aside className="w-[15%] bg-white fixed">
        <Sidenav />
      </aside>
      <section className="w-full">
        <Dbnav />
        {children || <Outlet />}
      </section>
    </main>
  );
}
