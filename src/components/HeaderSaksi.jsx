/* eslint-disable react/prop-types */
import { useNavigate } from "react-router-dom";
import Dropdown, { DropdownItem } from "./atoms/Dropdown";
import { FiLogOut } from "react-icons/fi";
import Swal from "sweetalert2";
import { HiMenuAlt3 } from "react-icons/hi";
import { motion } from "framer-motion";
import { slideInFromBottom, sideBar } from "../utils/motion.js";
import { FaChevronRight } from "react-icons/fa6";
import { useState } from "react";
import { clearAllCookies } from "../utils/cookies";

export default function HeaderSaksi({ user }) {
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
        clearAllCookies();
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
                  Saksi
                </motion.h1>

                <motion.div
                  variants={slideInFromBottom(0.5)}
                  className="flex flex-row w-full px-6"
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
      <div className="flex flex-col w-full border-b-4 border-primary px-6 xl:px-12 py-8">
        <div className="hidden xl:flex flex-col justify-center absolute">
          <div className="flex flex-row items-center">
            <div className="w-[80px] h-auto">
              <img src="/images/kamar-hitung.png" alt="profile" />
            </div>
            <div className="flex flex-col pl-4">
              <h1 className="text-3xl font-bold text-black">Kamar</h1>
              <h1 className="text-3xl font-bold font-sans text-black">
                Hitung
              </h1>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center text-center w-full">
          <div className="xl:hidden flex flex-row w-full justify-between pb-8">
            <div className="flex flex-row">
              <div className="rounded-md w-[40px] h-auto">
                <img src="/images/kamar-hitung.png" alt="profile" />
              </div>
              <div className="flex flex-col pl-2">
                <h1 className="text-xl font-semibold text-gray-500">
                  Kamar Hitung
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

          <h1 className="text-2xl xl:text-3xl font-semibold pt-4">
            Input Data Suara TPS
          </h1>

          <h1 className="text-2xl xl:text-3xl">
            Pemilihan Walikota & Wakil Walikota
          </h1>
          <h1 className="text-2xl xl:text-3xl text-semibold ">
            Kota Banda Aceh
          </h1>
        </div>

        <div className="flex flex-col items-end justify-center absolute right-0 px-8">
          <Dropdown
            trigger={
              <div className="hidden xl:flex flex-row">
                <div className="bg-gray-600 rounded-full w-[50px] h-[50px]">
                  <img
                    src="/images/profile.jpg"
                    alt="profile"
                    className="rounded-full"
                  />
                </div>
                <div className="flex flex-col pl-2">
                  <h1 className="text-xl">{user.fullname}</h1>
                  <h1 className="text-md uppercase text-gray-600">Saksi</h1>
                </div>
              </div>
            }
          >
            <DropdownItem onClick={handleLogout}>
              <FiLogOut size={20} className="text-red-600" />
              <h1 className="text-red-600">Keluar</h1>
            </DropdownItem>
          </Dropdown>
        </div>
      </div>
    </>
  );
}
