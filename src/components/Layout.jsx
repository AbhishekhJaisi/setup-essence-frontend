import NavBar from "./NavBar";
import { Outlet } from "react-router-dom";

function Layout() {
  return (
    <div className="min-h-screen bg-[#f5f5f7]">
      <NavBar />
      <main className="px-3 pb-8 pt-4 sm:px-5 sm:pt-5 lg:px-8">
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;
