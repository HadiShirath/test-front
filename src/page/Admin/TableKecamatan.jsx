import Sidebar from "../../components/Sidebar";
import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { parseToken } from "../../utils/parseToken";
import Cookies from "js-cookie";
import { calculatePercentages } from "../../utils/countPercentage";
import Swal from "sweetalert2";
import CandidateVotes from "../../components/CandidateVotes";
import Footer from "../../components/Footer";
import RunningText from "../../components/RunningText";
import HeaderAdmin from "../../components/HeaderAdmin";
import { motion } from "framer-motion";
import { MdOutlineRefresh } from "react-icons/md";
import { FiX } from "react-icons/fi";
import { generateRandomString } from "../../utils/generateRandomString";
import { HiEye } from "react-icons/hi2";
import CircularProgress from "@mui/material/CircularProgress";
import StickyHeadTable from "../../components/StickyHeadTable";
import Breadcrumbs from "../../components/Breadcrumbs";
import { AlertError } from "../../utils/customAlert";
import { clearAllCookies } from "../../utils/cookies";
import { MdLocalPrintshop } from "react-icons/md";
import { useReactToPrint } from "react-to-print";

export default function TableKecamatan() {
  const { kecamatan, kelurahan, tps } = useParams();
  const [expanded, setExpanded] = useState(true);
  const navigate = useNavigate();
  const [dataVoter, setDataVoter] = useState({});
  const [percentage, setPercentage] = useState([]);
  const [isOpenModalSaksi, setIsOpenModalSaksi] = useState(false);
  const [nameKoordinator, setNameKoordinator] = useState("");
  const [hpKoordinator, setHpKoordinator] = useState("");
  const [randomPassword, setRandomPassword] = useState("");
  const [isHidePassword, setIsHidePassword] = useState(false);
  const [validateUpdateData, setValidateUpdateData] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userDetail, setUserDetail] = useState("");
  const [listKecamatan, setListKecamatan] = useState("");
  const [allVotes, setAllVotes] = useState("");

  const componentRef = useRef(null);

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

    fetch("http://localhost:4000/v1/kecamatan/all", {
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
        setListKecamatan(data.payload);
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

    fetch("http://localhost:4000/v1/tps/voter/all", {
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
        const dataVoter = data.payload;

        const dataset = [
          dataVoter.paslon1,
          dataVoter.paslon2,
          dataVoter.paslon3,
          dataVoter.paslon4,
          dataVoter.suara_tidak_sah,
        ];

        const percentages = calculatePercentages(dataset);

        setDataVoter(dataset);
        setPercentage(percentages);
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

    fetch("http://localhost:4000/v1/kecamatan", {
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
  }, [navigate, kecamatan, kelurahan, tps]);

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

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

      fetch(`http://localhost:4000/v1/user/${userId}`, {
        method: "PUT",
        body: JSON.stringify(data),
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
        .then((response) => response.json())
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
          Swal.fire({
            title: "Terjadi Kesalahan",
            text: error,
            icon: "error",
            showConfirmButton: false,
            timer: 2000,
          })
        );
    }
  };

  return (
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
          expanded ? "pl-72" : "pl-28"
        } flex transition-all duration-300 py-4 z-[10]  w-full h-screen`}
      >
        <div className="flex flex-col w-full">
          <HeaderAdmin
            expanded={expanded}
            setExpanded={setExpanded}
            title="Tabel"
            user={userDetail}
            allVotes={allVotes}
          />

          <div className="flex pr-4"></div>

          <div ref={componentRef}>
            <div className="px-6 pt-8">
              <h1 className="text-2xl font-semibold text-primary">
                Data Tabel Informasi Suara
              </h1>
              <h1 className="text-3xl font-semibold">Kabupaten Aceh Besar</h1>
            </div>

            <div className="flex pt-4">
              <Breadcrumbs
                kecamatan={kecamatan}
                kelurahan={kelurahan}
                tps={tps}
                table
                admin
              />
            </div>

            <div className="flex flex-col w-full px-6 pt-2">
              <StickyHeadTable
                data={listKecamatan ? listKecamatan : []}
                kecamatan
              />
            </div>
          </div>

          <CandidateVotes percentage={percentage} dataVoter={dataVoter} />

          <div className="flex flex-row mt-2  px-16 items-center">
            <div
              className="border-[2px] border-primary py-3 flex flex-row w-full justify-center rounded-xl gap-2"
              onClick={handlePrint}
            >
              <MdLocalPrintshop size={24} className="text-primary" />
              <h1 className="text-primary text-lg">Cetak</h1>
            </div>
          </div>

          <RunningText />
          <Footer />
        </div>
      </div>
    </div>
  );
}
