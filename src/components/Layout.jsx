import NavBar from "./NavBar";
import { Outlet } from "react-router-dom";
import StickyEventBanner from "./StickyEventBanner";

function Layout() {
  return (
    <div className="min-h-screen bg-[linear-gradient(135deg,#f7fbff_0%,#f7f3ff_44%,#fff8f0_100%)]">
      <NavBar />
      <StickyEventBanner compact />
      <main className="px-3 pb-8 pt-4 sm:px-5 sm:pt-5 lg:px-8">
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;
