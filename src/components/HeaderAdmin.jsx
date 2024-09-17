/* eslint-disable react/prop-types */
import { FaHome } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { LuChevronFirst, LuChevronLast } from "react-icons/lu";
import Dropdown, { DropdownItem, DropdownProfile } from "./atoms/Dropdown";
import { FiLogOut } from "react-icons/fi";
import Swal from "sweetalert2";
import Cookies from "js-cookie";
import PercentageVote from "./PercentageVote";

export default function HeaderAdmin({
  setExpanded,
  expanded,
  title,
  user,
  allVotes,
}) {
  const navigate = useNavigate();

  const handleLogout = () => {
    Swal.fire({
      title: "Keluar Akun",
      text: "Apakah anda yakin?",
      // icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yakin",
      confirmButtonColor: "#ef4444",
      focusConfirm: false,
      cancelButtonText: "Batal",
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        Cookies.remove("access_token");
        navigate("/login");
      }
    });
  };


  return (
    <div className="flex flex-row w-full justify-between py-6">
      <div className="flex flex-col w-full px-6">
        <div className="flex flex-row items-center">
          <FaHome size={20} className="text-white" />
          <h1 className="pl-2 text-white">/ {title}</h1>
          <button
            onClick={() => setExpanded((curr) => !curr)}
            className="hidden xl:flex p-1.5 z-[10] rounded-lg ml-3 bg-gray-50 hover:bg-gray-100"
          >
            {expanded ? (
              <LuChevronFirst size={20} />
            ) : (
              <LuChevronLast size={20} />
            )}
          </button>
        </div>

        <h1 className="text-3xl text-white font-semibold pt-2">{title}</h1>
        <h1 className="text-xl text-white">
          Real Quick Count Pemilihan Bupati & Wakil Bupati
        </h1>
        <h1 className="text-xl text-white ">Kabupaten Aceh Besar</h1>

      
      </div>

      <div className="hidden xl:flex flex-col w-full justify-between items-end pr-6">
        <Dropdown
          trigger={
            <div className="flex flex-col bg-gray-600 rounded-full w-16">
              <img
                src="/images/profile.jpg"
                alt="profile"
                className="rounded-full"
              />
            </div>
          }
        >
          <DropdownProfile>
            <img src={`/images/profile.jpg`} className="w-12 rounded-full" />
            <div className="py-2">
              <p className="font-medium">{user ? user.fullname : ""}</p>
              <a className="text-sm font-medium text-gray-500 uppercase">
                {user ? user.role : ""}
              </a>
            </div>
          </DropdownProfile>
          <hr className="py-1" />
          <DropdownItem onClick={handleLogout}>
            <FiLogOut size={20} className="text-red-600" />
            <h1 className="text-red-600">Keluar</h1>
          </DropdownItem>
        </Dropdown>

        <div className="bg-white p-3 px-4 rounded-xl">
          <PercentageVote allVotes={allVotes} />
        </div>
      </div>
    </div>
  );
}
