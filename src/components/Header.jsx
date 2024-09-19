/* eslint-disable react/prop-types */
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import Dropdown, { DropdownItem, DropdownProfile } from "./atoms/Dropdown";
import { FiLogOut } from "react-icons/fi";
import Swal from "sweetalert2";
import { HiMenuAlt3 } from "react-icons/hi";
import { motion } from "framer-motion";
import { slideInFromBottom, sideBar } from "../utils/motion.js";
import { FaChevronRight } from "react-icons/fa6";
import { useState } from "react";

export default function Header({ user }) {
  const [isVisible, setIsVisible] = useState(false);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

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
        Cookies.remove("access_token");
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
          className="fixed md:hidden w-full h-full z-[20]"
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
                    {user.role}
                </motion.h1>

                <motion.div
                  variants={slideInFromBottom(0.5)}
                  className="flex flex-row w-full px-6"
                >
                  <div
                    className="flex flex-row bg-red-50 w-full justify-center cursor-pointer rounded-xl"
                    onClick={handleLogout}
                  >
                    <div className="flex flex-row py-4 items-center" >
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
      <div className="flex flex-col w-full items-center border-b-4 border-primary pt-8 pb-8">
        <div className="flex flex-row w-full  justify-between px-8 xl:px-12 ">
          <div className="hidden xl:flex flex-col justify-center w-full">
            <div className="flex flex-row items-center">
              <div className="bg-red-500 bg-red rounded-2xl w-[70px] h-[70px]">
                {/* <img src="/images/kamar-hitung.png" alt="profile" /> */}
              </div>
              <div className="flex flex-col pl-2">
                <h1 className="text-3xl font-bold text-red-400">Kamar</h1>
                <h1 className="text-3xl font-bold font-sans text-red-400">
                  Hitung.id
                </h1>
              </div>
            </div>
          </div>

          <div className="flex flex-col justify-center text-center  items-center w-full">
            <div className="xl:hidden flex flex-row w-full justify-between pb-3">
              <div className="flex flex-row">
                <div className="bg-red-500 rounded-md w-[25px] h-[25px]">
                  {/* <img src="/images/kamar-hitung.png" alt="profile" /> */}
                </div>
                <div className="flex flex-col pl-2">
                  <h1 className="text-xl font-bold text-red-400">
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
                  className={`text-primary transition-all duration-500`}
                />
              </div>
            </div>

            <h2 className="text-xl md:text-4xl font-semibold">
              Real Quick Count Pemilihan
            </h2>
            <h2 className="text-xl md:text-4xl font-semibold">
              Bupati & Wakil Bupati
            </h2>
            <h2 className="text-xl md:text-3xl ">Kabupaten Aceh Besar</h2>

            {/* <h2 className="text-xl md:text-4xl font-semibold">
            Lorem ipsum dolor sit amet
          </h2>
          <h2 className="text-xl md:text-4xl font-semibold">
            consectetur adipiscing elit
          </h2>
          <h2 className="text-xl md:text-3xl ">sed do eiusmod tempor</h2> */}
          </div>

          <div className="hidden xl:flex flex-col w-full items-end justify-center">
            <Dropdown
              trigger={
                <div className="flex flex-col rounded-full w-16">
                  <img
                    src="/images/profile.jpg"
                    alt="profile"
                    className="rounded-full"
                  />
                </div>
              }
            >
              <DropdownProfile>
                <img
                  src={`/images/profile.jpg`}
                  className="w-12 rounded-full"
                />
                <div className="py-2">
                  <p className="font-medium">{user.fullname}</p>
                  <a className="text-sm font-medium text-gray-500 uppercase">
                    {user.role}
                  </a>
                </div>
              </DropdownProfile>
              <DropdownItem onClick={handleLogout}>
                <FiLogOut size={20} className="text-red-600" />
                <h1 className="text-red-600">Keluar</h1>
              </DropdownItem>
            </Dropdown>
          </div>
        </div>
      </div>
    </>
  );
}
