import Header from "@/components/header";
import {Outlet} from "react-router-dom";

const AppLayout = () => {
  return (
    <div>
      <main className="container min-h-screen mx-auto">
        <Header />
        <Outlet />
      </main>
      <div className="p-10 mt-10 text-center bg-gray-800">
        Made with 💗 by Prajwal A S
      </div>
    </div>
  );
};

export default AppLayout;
