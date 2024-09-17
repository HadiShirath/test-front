/* eslint-disable no-undef */
import Sidebar from "../../components/Sidebar";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { parseToken } from "../../utils/parseToken";
import Cookies from "js-cookie";
import Swal from "sweetalert2";
import Footer from "../../components/Footer";
import RunningText from "../../components/RunningText";
import HeaderAdmin from "../../components/HeaderAdmin";
import { motion } from "framer-motion";
import { MdOutlineRefresh } from "react-icons/md";
import { FiX } from "react-icons/fi";
import { generateRandomString } from "../../utils/generateRandomString";
import { HiEye } from "react-icons/hi2";
import CircularProgress from "@mui/material/CircularProgress";
import Breadcrumbs from "../../components/Breadcrumbs";
import { AlertError } from "../../utils/customAlert";
import { clearAllCookies } from "../../utils/cookies";
import ModalPhoto from "../../components/atoms/ModalPhoto";

export default function Photo() {
  const { kecamatan, kelurahan, tps } = useParams();
  const [expanded, setExpanded] = useState(true);
  const [data, setData] = useState("");
  const navigate = useNavigate();
  const [isOpenModalSaksi, setIsOpenModalSaksi] = useState(false);
  const [nameKoordinator, setNameKoordinator] = useState("");
  const [hpKoordinator, setHpKoordinator] = useState("");
  const [randomPassword, setRandomPassword] = useState("");
  const [isHidePassword, setIsHidePassword] = useState(false);
  const [validateUpdateData, setValidateUpdateData] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userDetail, setUserDetail] = useState("");
  const [allVotes, setAllVotes] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const apiUrl = import.meta.env.VITE_API_URL;
  const apiUrlBase = import.meta.env.VITE_API_URL_BASE;

  const token = Cookies.get("access_token");

  useEffect(() => {
    const token = Cookies.get("access_token");
    // Membaca cookie saat aplikasi dimuat
    if (token) {
      const data = parseToken(token);

      const user = {
        fullname: data.fullname,
        role: data.role,
      };
      setUserDetail(user);

      if (data.role !== "admin") {
        Cookies.remove("access_token");
        navigate(`/login`);
      }
    } else {
      AlertError({ title: "Waktu Habis", text: "Sesi Anda Berakhir" });

      setTimeout(() => {
        clearAllCookies();
        navigate("/login");
      }, 2000);
    }

    fetch(`${apiUrl}/tps/voter/${tps}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (response.status === 401) {
          throw new Error("Sesi Anda Berakhir");
        }

        return response.json();
      })
      .then((data) => {
        setData(data.payload);
      })
      .catch((error) =>
        AlertError({
          title:
            error.message === "Sesi Anda Berakhir"
              ? "Waktu Habis"
              : "Terjadi Kesalahan",
          text: error.message,
        })
      );

    fetch(`${apiUrl}/kecamatan`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (response.status === 401) {
          throw new Error("Sesi Anda Berakhir");
        }

        return response.json();
      })
      .then((data) => {
        setAllVotes(data.payload);
      })
      .catch((error) =>
        AlertError({
          title:
            error.message === "Sesi Anda Berakhir"
              ? "Waktu Habis"
              : "Terjadi Kesalahan",
          text: error.message,
        })
      );
  }, [navigate, kecamatan, kelurahan, tps, apiUrl]);

  const handleDetailPhoto = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setRandomPassword("");
    setValidateUpdateData(false);
    setIsOpenModalSaksi(!isOpenModalSaksi);
  };

  const handleChangeNameKoordinator = (event) => {
    setNameKoordinator(event.target.value);
  };

  const handleChangeHPKoordinator = (event) => {
    setHpKoordinator(event.target.value);
  };

  const handleChangePassword = () => {
    const randomString = generateRandomString(4);
    setRandomPassword(randomString);
  };

  const handleSubmit = () => {
    setLoading(true);
    const previousName = isOpenModalSaksi.name_koordinator;
    const previousHp = isOpenModalSaksi.hp_koordinator;

    const data = {
      fullname: nameKoordinator,
      username: hpKoordinator,
      password: randomPassword,
    };

    if (
      nameKoordinator === previousName &&
      hpKoordinator === previousHp &&
      !randomPassword
    ) {
      setTimeout(() => {
        setLoading(false);
        setValidateUpdateData(true);
      }, 500);
    } else {
      setValidateUpdateData(false);

      const userId = isOpenModalSaksi.user_id;

      fetch(`${apiUrl}/user/${userId}`, {
        method: "PUT",
        body: JSON.stringify(data),
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
        .then((response) => {
          if (response.status === 401) {
            throw new Error("Sesi Anda Berakhir");
          }

          return response.json();
        })
        .then((data) => {
          if (data.success) {
            Swal.fire({
              title: "Berhasil",
              text: "Berhasil mengubah data",
              icon: "success",
              showConfirmButton: false,
              timer: 2000,
            });

            setTimeout(() => {
              setLoading(false);
              window.location.reload();
            }, 2000);
          }
        })
        .catch((error) =>
          AlertError({
            title:
              error.message === "Sesi Anda Berakhir"
                ? "Waktu Habis"
                : "Terjadi Kesalahan",
            text: error.message,
          })
        );
    }
  };

  return (
    <>
      {isModalOpen && (
        <ModalPhoto
          photo={data.photo}
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
        />
      )}
      <div className="flex flex-row h-full w-full relative">
        {isOpenModalSaksi && (
          <div className="fixed w-full h-full flex top-0  bottom-0 items-center justify-center z-[60]">
            <div
              className="w-full h-full bg-black opacity-40"
              onClick={handleCloseModal}
            />
            <motion.div
              initial={{ opacity: 0.5, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                type: "spring",
                stiffness: 260,
                damping: 40,
              }}
              className="border-opacity-40 rounded-3xl absolute"
            >
              <div className="flex flex-col bg-white rounded-3xl mx-4 p-8 md:p-16 ">
                <div
                  className="absolute right-10 cursor-pointer md:px-4 top-8"
                  onClick={handleCloseModal}
                >
                  <FiX size={24} />
                </div>
                <h1 className="text-3xl font-semibold">Edit Profile Saksi</h1>
                <h1 className="text-xl max-w-[400px] pt-2">
                  Kecamatan {isOpenModalSaksi.kecamatan_name} Kelurahan{" "}
                  {isOpenModalSaksi.kelurahan_name} {isOpenModalSaksi.tps_name}
                </h1>

                <div className="flex flex-col w-full h-0.5 bg-gray-400 mt-6"></div>

                {validateUpdateData ? (
                  <h1 className="italic text-red-600 pt-2">
                    *Tidak ada perubahan data
                  </h1>
                ) : (
                  <div className="pt-8" />
                )}

                <h2 className="text-xl pt-5">Nama Koordinator</h2>
                <input
                  className="h-12 text-lg text-gray-600 rounded-xl px-4 bg-gray-50"
                  value={nameKoordinator}
                  onChange={handleChangeNameKoordinator}
                />
                <h2 className="text-xl pt-8">HP Koordinator</h2>
                <input
                  className="h-12 text-lg text-gray-600 rounded-xl px-4 bg-gray-50"
                  value={hpKoordinator}
                  onChange={handleChangeHPKoordinator}
                />
                <div className="flex flex-col">
                  <div className="flex flex-row items-center pt-8">
                    <h2 className="text-xl ">Password </h2>
                    <h2 className="text-sm text-gray-500 italic pl-1">
                      (Opsional)
                    </h2>
                  </div>
                  <div className="flex flex-row gap-4">
                    <div className="flex flex-col w-full relative">
                      <input
                        className="h-12 w-full rounded-xl px-4 bg-gray-50"
                        value={randomPassword}
                        type={isHidePassword ? "text" : "password"}
                        readOnly
                      />
                      <div
                        className="absolute h-12 right-3 z-10 px-2 cursor-pointer"
                        onClick={() => setIsHidePassword(!isHidePassword)}
                      >
                        <HiEye className="h-12 text-gray-400 " size={20} />
                      </div>
                    </div>
                    <div
                      className="flex flex-row  bg-slate-500 rounded-xl justify-center items-center px-4 cursor-pointer"
                      onClick={handleChangePassword}
                    >
                      <MdOutlineRefresh size={24} className="text-white" />
                      <h1 className="hidden md:flex text-white text-center text-xl ml-2">
                        Generate
                      </h1>
                    </div>
                  </div>
                </div>

                {loading ? (
                  <div className="w-full flex flex-row mt-8  justify-center  bg-gray-300 py-4 items-center rounded-xl cursor-pointer">
                    <CircularProgress sx={{ color: "#ffffff" }} size={25} />
                    <h1 className="text-white text-xl font-semibold pl-2">
                      Loading
                    </h1>
                  </div>
                ) : (
                  <div
                    className="w-full flex flex-col mt-8  bg-primary py-4 items-center rounded-xl cursor-pointer"
                    onClick={handleSubmit}
                  >
                    <h1 className="text-white text-xl font-semibold">Submit</h1>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}

        <div className="flex flex-col bg-primary w-full absolute -z-20 h-52" />

        <Sidebar expanded={expanded} setExpanded={setExpanded} />

        <div
          className={`${
            expanded ? "xl:pl-72" : "xl:pl-28"
          } flex transition-all duration-300 py-4 z-[10] w-full h-screen`}
        >
          <div className="flex flex-col w-full">
            <HeaderAdmin
              expanded={expanded}
              setExpanded={setExpanded}
              title="Foto FORM C1"
              user={userDetail}
              allVotes={allVotes}
            />


          <div className="flex flex-col w-full items-center">

            <div className="px-6 pt-12 text-center">
              <h1 className="text-2xl font-semibold text-primary">
               Data Foto Form C1
              </h1>
              <h1 className="text-xl xl:text-3xl font-semibold">
                Kecamatan <span>{data.kecamatan_name},</span> Kelurahan{" "}
                <span>{data.kelurahan_name},</span> {data.tps_name}{" "}
              </h1>
            </div>

            <div className="flex pt-4">
              <Breadcrumbs
                valueKecamatan={data.kecamatan_name}
                valueKelurahan={data.kelurahan_name}
                valueTps={data.tps_name}
                photo
                admin
              />
            </div>

            {data.photo && data.photo !== "" ? (
              <div className="flex flex-col w-full items-center px-6">
                <div
                  className="w-full h-[500px] sm:w-[400px] sm:h-[600px] rounded-2xl border-gray-200 border-[4px] relative"
                  onClick={handleDetailPhoto}
                >
                  <img
                    id="image"
                    src={`${apiUrlBase}/images/${data.photo}`}
                    alt="form-c1"
                    className="w-full h-full object-cover rounded-xl"
                  />
                </div>
              </div>
            ) : (
              <div className="flex flex-col w-full items-center">
                <img
                  src="/images/Not-found.jpg"
                  alt=""
                  className="w-full h-auto sm:w-[450px] sm:h-[450px]"
                />
                <h1 className="text-2xl text-center xl:text-4xl font-semibold text-orange-500 pt-8">
                  TPS ini Belum Ada Foto C1
                </h1>
                <h1 className="text-xl xl:text-3xl text-gray-500 text-center">
                  Data Foto tidak ditemukan
                </h1>
              </div>
            )}
          </div>


            {/* <div className="flex flex-col w-full px-6 pt-2">
            <StickyHeadTable data={listKecamatan ? listKecamatan : []} kecamatan/> 
          </div> */}

            {/* <CandidateVotes percentage={percentage} dataVoter={dataVoter} / */}

            <RunningText
              totalSuara={allVotes.total_suara}
              persentase={allVotes.persentase}
            />
            <Footer />
          </div>
        </div>
      </div>
    </>
  );
}
