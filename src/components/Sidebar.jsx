/* eslint-disable react/prop-types */
import { useContext, createContext } from "react";
import { FaDesktop, FaTable, FaVoteYea, FaUsers, FaUser } from "react-icons/fa";
import { HiMail, HiMailOpen } from "react-icons/hi";
import { useNavigate, useLocation } from "react-router-dom";

const SidebarContext = createContext();

export default function Sidebar({ setExpanded, expanded }) {
  return (
    <div className="z-[50] fixed hidden xl:flex">
      <SidebarContainer expanded={expanded} setExpanded={setExpanded}>
        <SidebarItem
          icon={<FaDesktop size={18} className="text-blue-500" />}
          text="Dashboard"
          path="/admin/dashboard"
          alert
        />
        <SidebarItem
          icon={<FaTable size={18} className="text-orange-500" />}
          text="Tabel"
          path="/admin/table"
        />
        <SidebarItem
          icon={<FaVoteYea size={18} className="text-blue-500" />}
          text="TPS"
          path="/admin/tps"
        />
        <SidebarItem
          icon={<FaUsers size={18} className="text-violet-500" />}
          text="User"
          path="/admin/user"
        />
        <hr className="my-3" />
        <SidebarItem
          icon={<HiMail size={20} className="text-yellow-500" />}
          text="Pesan Masuk"
          path="/admin/inbox"
        />
        <SidebarItem
          icon={<HiMailOpen size={20} className="text-red-500" />}
          text="Pesan Keluar"
          path="/admin/outbox"
        />
        <hr className="my-3" />
        <SidebarItem
          icon={<FaUser size={18} className="text-green-500" />}
          text="Profile"
           path="/admin/profile"
        />
      </SidebarContainer>
    </div>
  );
}

export function SidebarContainer({ children, expanded }) {
  return (
    <aside
      className={`${
        expanded ? "w-72" : "w-28"
      } p-4 transition-all duration-500 h-screen`}
    >
      <nav className="h-full flex flex-col bg-white rounded-2xl shadow-xl">
        <div
          className={`${
            expanded ? "px-8" : "px-4"
          } p-6 pb-10 pt-10 transition-all duration-300 flex flex-row items-center`}
        >
          <img
            src="/images/kamar-hitung.png"
            alt=""
            className="w-12"
          />

          <h1
            className={`${
              expanded ? "w-52" : "w-0"
            } ml-3 overflow-hidden text-xl font-semibold`}
          >
            KamarHitung
          </h1>
        </div>

        <SidebarContext.Provider value={{ expanded }}>
          <ul className="flex-1 px-3">{children}</ul>
        </SidebarContext.Provider>


      </nav>
    </aside>
  );
}

export function SidebarItem({ icon, text, path, alert }) {
  const { expanded } = useContext(SidebarContext);
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = location.pathname === path;

  const handleClick = () => {
    if (text === "Dashboard") {
      navigate("/admin/dashboard");
    } else if (text === "User") {
      navigate("/admin/user");
    } else if (text === "Pesan Masuk") {
      navigate("/admin/inbox");
    } else if (text === "Pesan Keluar") {
      navigate("/admin/outbox");
    } else if (text === "TPS") {
      navigate("/admin/tps");
    } else if (text === "Tabel") {
      navigate("/admin/table");
    } else if (text === "Profile") {
      navigate("/admin/profile");
    }
  };

  return (
    <div
      className={`
        relative flex items-center py-4  my-1
        rounded-xl cursor-pointer
        transition-colors group
        ${isActive ? "bg-indigo-50" : "hover:bg-indigo-50 text-gray-600"}
    `}
      onClick={handleClick}
    >
      <span className="px-4 ">{icon}</span>
      <span
        className={`overflow-hidden text-sm transition-all ${
          expanded ? "w-52" : "w-0"
        }`}
      >
        {text}
      </span>
      {alert && (
        <div
          className={`absolute right-2 w-2 h-2 rounded bg-indigo-400 ${
            expanded ? "" : "top-2"
          }`}
        />
      )}

      {!expanded && (
        <div
          className={`
          absolute left-full rounded-md px-2 py-1 ml-6
          bg-indigo-50 text-indigo-600 text-sm
          invisible opacity-20 -translate-x-3 transition-all
          group-hover:visible group-hover:opacity-100 group-hover:translate-x-0
      `}
        >
          {text}
        </div>
      )}
    </div>
  );
}
