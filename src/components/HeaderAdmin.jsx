/* eslint-disable react/prop-types */
import { FaHome } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { LuChevronFirst, LuChevronLast } from "react-icons/lu";
import Dropdown, { DropdownItem, DropdownProfile } from "./atoms/Dropdown";
import { FiLogOut } from "react-icons/fi";
import Swal from "sweetalert2";
import PercentageVote from "./PercentageVote";
import { useState } from "react";
import { HiMenuAlt3 } from "react-icons/hi";
import { motion } from "framer-motion";
import { slideInFromBottom, sideBar } from "../utils/motion.js";
import { FaChevronRight } from "react-icons/fa6";
import { FaDesktop, FaTable, FaVoteYea, FaUsers } from "react-icons/fa";
import { clearAllCookies } from '../utils/cookies';

export default function HeaderAdmin({
  setExpanded,
  expanded,
  title,
  user,
  allVotes,
}) {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setIsVisible(true); // Make the sidebar visible
    setOpen(true); // Open the sidebar
  };

  const handleClose = () => {
    setOpen(false); // Start the exit animation
    setTimeout(() => setIsVisible(false), 300);
  };

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
        clearAllCookies()
        navigate("/login");
      }
    });
  };

  return (
    <>
      {isVisible && (
        <motion.div
          initial="offscreen"
          animate={open ? "onscreen" : "offscreen"}
          exit="offscreen"
          className="fixed top-0 md:hidden w-full h-full z-[20]"
        >
          <div
            className="w-full h-full bg-black opacity-40"
            onClick={handleClose}
          />
          <motion.div
            variants={sideBar()}
            className="absolute w-1/2 h-full shadow-xl right-0 top-0 bg-[#ffffff]"
          >
            <motion.div
              variants={slideInFromBottom(0.1)}
              className="flex justify-between mt-12 mx-6"
              onClick={handleClose}
            >
              <h1 className="text-xl">Profile</h1>
              <FaChevronRight size={25} className=" text-primary" />
            </motion.div>
            <div className="flex flex-col items-center h-full justify-between py-12">
              <div className="flex flex-col items-center">
                <motion.div
                  variants={slideInFromBottom(0.5)}
                  className="pt-2 pb-8"
                >
                  <img
                    src="/images/profile.jpg"
                    alt="profile"
                    className="rounded-full w-24 h-24"
                  />
                </motion.div>

                <motion.h1
                  variants={slideInFromBottom(0.5)}
                  className="text-xl font-semibold text-center px-12"
                >
                  {user.fullname}
                </motion.h1>
                <motion.h1
                  variants={slideInFromBottom(0.5)}
                  className="text-xl text-center text-gray-500 uppercase px-12 pb-8"
                >
                  ADMIN
                </motion.h1>

                <motion.div
                  variants={slideInFromBottom(0.5)}
                  className="mb-4 flex flex-col w-[70%] h-0.5 bg-gray-300 px-10 items-start"
                ></motion.div>

                <motion.div
                  variants={slideInFromBottom(0.5)}
                  className="pt-2 pb-2 flex flex-col w-full px-10 items-start"
                >
                  <a href="/admin/dashboard">
                    <div className="flex flex-row items-center">
                      <FaDesktop size={20} className="text-blue-500" />
                      <h1 className="pl-2">Dashboard</h1>
                    </div>
                  </a>
                </motion.div>

                <motion.div
                  variants={slideInFromBottom(0.5)}
                  className="pt-2 pb-2 flex flex-col w-full px-10 items-start"
                >
                  <a href="/admin/table">
                    <div className="flex flex-row items-center">
                      <FaTable size={20} className="text-orange-500" />
                      <h1 className="pl-2">Tabel</h1>
                    </div>
                  </a>
                </motion.div>

                <motion.div
                  variants={slideInFromBottom(0.5)}
                  className="pt-2 pb-2 flex flex-col w-full px-10 items-start"
                >
                  <a href="/admin/tps">
                    <div className="flex flex-row items-center">
                      <FaVoteYea size={20} className="text-blue-500" />
                      <h1 className="pl-2">TPS</h1>
                    </div>
                  </a>
                </motion.div>

                <motion.div
                  variants={slideInFromBottom(0.5)}
                  className="pt-2 pb-8 flex flex-col w-full px-10 items-start"
                >
                  <a href="/admin/saksi">
                    <div className="flex flex-row items-center">
                      <FaUsers size={20} className="text-violet-500" />
                      <h1 className="pl-2">Saksi</h1>
                    </div>
                  </a>
                </motion.div>

                <motion.div
                  variants={slideInFromBottom(0.5)}
                  className="flex flex-row w-full px-8"
                >
                  <div
                    className="flex flex-row bg-red-50 w-full justify-center cursor-pointer rounded-xl"
                    onClick={handleLogout}
                  >
                    <div className="flex flex-row py-4 items-center">
                      <FiLogOut size={24} className="text-red-600" />
                      <h1 className="text-red-600 pl-3 text-xl">Keluar</h1>
                    </div>
                  </div>
                </motion.div>
              </div>

              <motion.h1
                variants={slideInFromBottom(1)}
                className="text-md w-full py-12 text-black text-center mb-8"
              >
                KamarHitung.id
              </motion.h1>
            </div>
          </motion.div>
        </motion.div>
      )}
      <div className="flex flex-row w-full justify-between py-6">
        <div className="flex flex-col w-full px-6">
          <div className="xl:hidden flex flex-row w-full justify-between pb-3">
            <div className="flex flex-row">
              <div className="bg-red-500 rounded-md w-[25px] h-[25px]">
                {/* <img src="/images/kamar-hitung.png" alt="profile" /> */}
              </div>
              <div className="flex flex-col pl-2">
                <h1 className="text-xl font-bold text-yellow-300">
                  Kamar Hitung.id
                </h1>
              </div>
            </div>

            <div
              className={`flex md:hidden transition-transform transform`}
              onClick={handleOpen}
            >
              <HiMenuAlt3
                size={30}
                className={`text-white transition-all duration-500`}
              />
            </div>
          </div>

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
    </>
  );
}
