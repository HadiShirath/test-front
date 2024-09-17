/* eslint-disable react/prop-types */
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import Dropdown, { DropdownItem, DropdownProfile } from "./atoms/Dropdown";
import { FiLogOut } from "react-icons/fi";
import Swal from "sweetalert2";
import { HiMenuAlt3 } from "react-icons/hi";


export default function Header({ user, open, setOpen}) {
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
    <div className="flex flex-col w-full items-center border-b-4 border-primary pt-12 pb-8">
        
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
            {/* <div className="absolute right-5">
              <Dropdown
                trigger={
                  <div className="flex flex-row">
                    <div className="bg-gray-600 rounded-full w-[50px] h-[50px]">
                      <img
                        src="/images/profile.jpg"
                        alt="profile"
                        className="rounded-full"
                      />
                    </div>
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
            </div> */}

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
          onClick={() => setOpen(!open)}
        >
          <HiMenuAlt3
            size={30}
            className={`text-primary transition-all duration-500 ${
              open ? "rotate-45" : ""
            }`}
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
  );
}
