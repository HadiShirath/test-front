import Sidebar from "../../components/Sidebar";
import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { parseToken } from "../../utils/parseToken";
import Cookies from "js-cookie";
import Swal from "sweetalert2";
import Footer from "../../components/Footer";
import RunningText from "../../components/RunningText";
import HeaderAdmin from "../../components/HeaderAdmin";
import { motion } from "framer-motion";
import { FiX } from "react-icons/fi";
import CircularProgress from "@mui/material/CircularProgress";
import StickyHeadTable from "../../components/StickyHeadTable";
import ModalPhoto from "../../components/atoms/ModalPhoto";
import { AlertError } from "../../utils/customAlert";
import { clearAllCookies } from "../../utils/cookies";
import { MdLocalPrintshop } from "react-icons/md";
import { useReactToPrint } from "react-to-print";

export default function TPS() {
  const { kecamatan, kelurahan, tps } = useParams();
  const [expanded, setExpanded] = useState(true);
  const navigate = useNavigate();
  const [validateUpdateData, setValidateUpdateData] = useState(false);
  const [loading, setLoading] = useState(false);
  const [listDataTPS, setListDataTPS] = useState([]);
  const [isOpenModalEdit, setIsOpenModalEdit] = useState(false);
  const [paslon1, setPaslon1] = useState(0);
  const [paslon2, setPaslon2] = useState(0);
  const [paslon3, setPaslon3] = useState(0);
  const [paslon4, setPaslon4] = useState(0);
  const [suaraSah, setSuaraSah] = useState(0);
  const [suaraTidakSah, setSuaraTidakSah] = useState(0);
  const [isModalPhotoOpen, setIsModalPhotoOpen] = useState(false);
  const [userDetail, setUserDetail] = useState("");
  const [allVotes, setAllVotes] = useState("");

  const componentRef = useRef();

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
        clearAllCookies();
        navigate(`/login`);
      }
    } else {
      AlertError({ title: "Waktu Habis", text: "Sesi Anda Berakhir" });

      setTimeout(() => {
        clearAllCookies();
        navigate("/login");
      }, 2000);
    }

    fetch(`${apiUrl}/tps/all`, {
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
        setListDataTPS(data.payload);
      });

    fetch(`${apiUrl}/kecamatan/voters`, {
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
      });
  }, [navigate, kecamatan, kelurahan, tps, apiUrl]);

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  const handleCloseModal = () => {
    setValidateUpdateData(false);
    setIsOpenModalEdit(!isOpenModalEdit);
  };

  const handleDetailPhoto = () => {
    setIsModalPhotoOpen(true);
  };

  const handleValue = (event, setPaslon, setSuaraSah, index) => {
    var newValue = parseInt(event.target.value, 10);
    if (isNaN(newValue)) {
      newValue = 0;
    }
    setPaslon(newValue);

    // suara paslon
    const updatedPaslons = [paslon1, paslon2, paslon3, paslon4];
    updatedPaslons[index] = newValue;

    // Update suaraSah
    setSuaraSah(updatedPaslons.reduce((total, value) => total + value, 0));
  };

  const handleChangePaslon1 = (event) => {
    handleValue(event, setPaslon1, setSuaraSah, 0);
  };
  const handleChangePaslon2 = (event) => {
    handleValue(event, setPaslon2, setSuaraSah, 1);
  };
  const handleChangePaslon3 = (event) => {
    handleValue(event, setPaslon3, setSuaraSah, 2);
  };
  const handleChangePaslon4 = (event) => {
    handleValue(event, setPaslon4, setSuaraSah, 3);
  };

  const handleChangeSuaraTidakSah = (event) => {
    var newValue = parseInt(event.target.value, 10);
    if (isNaN(newValue)) {
      newValue = 0;
    }
    setSuaraTidakSah(newValue);

  };

  const handleSubmit = () => {
    setLoading(true);
    const previousPaslon1 = isOpenModalEdit.paslon1;
    const previousPaslon2 = isOpenModalEdit.paslon2;
    const previousPaslon3 = isOpenModalEdit.paslon3;
    const previousPaslon4 = isOpenModalEdit.paslon4;
    const previousSuaraSah = isOpenModalEdit.suara_sah;
    const previousSuaraTidakSah = isOpenModalEdit.suara_tidak_sah;

    const tpsId = isOpenModalEdit.tps_id;

    const data = {
      paslon1: paslon1,
      paslon2: paslon2,
      paslon3: paslon3,
      paslon4: paslon4,
      suara_sah: suaraSah,
      suara_tidak_sah: suaraTidakSah,
    };

    if (
      paslon1 === previousPaslon1 &&
      paslon2 === previousPaslon2 &&
      paslon3 === previousPaslon3 &&
      paslon4 === previousPaslon4 &&
      suaraSah === previousSuaraSah &&
      suaraTidakSah === previousSuaraTidakSah
    ) {
      setTimeout(() => {
        setLoading(false);
        setValidateUpdateData(true);
      }, 500);
    } else {
      setValidateUpdateData(false);

      fetch(`${apiUrl}/tps/voter/${tpsId}`, {
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
              text: "Berhasil mengubah data TPS",
              icon: "success",
              showConfirmButton: false,
              timer: 2000,
            });

            setLoading(false);

            setTimeout(() => {
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
    <>
      {isModalPhotoOpen && (
        <ModalPhoto
          photo={isOpenModalEdit.photo}
          isModalOpen={isModalPhotoOpen}
          setIsModalOpen={setIsModalPhotoOpen}
        />
      )}
      <div className="flex flex-row h-full w-full relative">
        {isOpenModalEdit && (
          <div className="fixed w-full h-full flex top-0 bottom-0 items-center justify-center z-[60]">
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
              <div className="flex flex-row bg-white rounded-3xl mx-6 p-8 md:p-16 ">
                <div
                  className="absolute right-12 cursor-pointer md:px-4 top-8"
                  onClick={handleCloseModal}
                >
                  <FiX size={24} />
                </div>

                <div className="hidden xl:flex flex-col w-[400px] mr-10">
                  {isOpenModalEdit.photo ? (
                    <div
                      className="w-[400px] h-[600px] rounded-2xl border-gray-200 border-[4px] relative"
                      onClick={handleDetailPhoto}
                    >
                      <img
                        id="image"
                        src={`${apiUrlBase}/images/${isOpenModalEdit.photo}`}
                        alt="form-c1"
                        className="w-full h-full object-cover rounded-xl"
                      />
                    </div>
                  ) : (
                    <div className="flex flex-col w-[400px] h-auto">
                      <img
                        src="/images/Not-found.jpg"
                        alt=""
                        className="w-full h-auto"
                      />
                      <h1 className="text-center xl:text-2xl font-semibold text-orange-500 pt-8">
                        TPS ini Belum Ada Foto
                      </h1>
                      <h1 className="text-xl xl:text-xl text-gray-500 text-center">
                        Data photo tidak ditemukan
                      </h1>
                    </div>
                  )}
                </div>

                <div className="flex flex-col w-full">
                  <h1 className="text-3xl font-semibold">Edit Suara TPS</h1>
                  <h1 className="text-xl max-w-[400px] pt-2">
                    Kecamatan {isOpenModalEdit.kecamatan_name} Kelurahan{" "}
                    {isOpenModalEdit.kelurahan_name} {isOpenModalEdit.tps_name}
                  </h1>

                  <div className="flex flex-col w-full h-0.5 bg-gray-400 mt-6"></div>

                  {validateUpdateData ? (
                    <h1 className="italic text-red-600 pt-2">
                      *Tidak ada perubahan data
                    </h1>
                  ) : (
                    <div className="pt-8" />
                  )}

                  <div className="flex flex-row w-full gap-4 my-5">
                    <div className="flex flex-col w-full">
                      <div className="flex flex-col bg-color1 rounded-md">
                        <h2 className="text-lg px-2 py-0.5 text-white">
                          Paslon 1
                        </h2>
                      </div>
                      <div className="flex flex-col w-full">
                        <input
                          className="px-4 h-12 w-full text-gray-600  rounded-xl bg-gray-100"
                          value={paslon1}
                          onChange={handleChangePaslon1}
                        />
                      </div>
                    </div>
                    <div className="flex flex-col w-full">
                      <div className="flex flex-col bg-color2 rounded-md">
                        <h2 className="text-lg px-2 py-0.5 text-white">
                          Paslon 2
                        </h2>
                      </div>
                      <div className="flex flex-col w-full">
                        <input
                          className="px-4 h-12 w-full text-gray-600  rounded-xl bg-gray-100"
                          value={paslon2}
                          onChange={handleChangePaslon2}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-row w-full gap-4 mb-5">
                    <div className="flex flex-col w-full">
                      <div className="flex flex-col bg-color3 rounded-md">
                        <h2 className="text-lg px-2 py-0.5 text-white">
                          Paslon 3
                        </h2>
                      </div>
                      <div className="flex flex-col w-full">
                        <input
                          className="px-4 h-12 w-full text-gray-600  rounded-xl bg-gray-100"
                          value={paslon3}
                          onChange={handleChangePaslon3}
                        />
                      </div>
                    </div>
                    <div className="flex flex-col w-full">
                      <div className="flex flex-col bg-color4 rounded-md">
                        <h2 className="text-lg px-2 py-0.5 text-white">
                          Paslon 4
                        </h2>
                      </div>
                      <div className="flex flex-col w-full">
                        <input
                          className="px-4 h-12 w-full text-gray-600  rounded-xl bg-gray-100"
                          value={paslon4}
                          onChange={handleChangePaslon4}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-row w-full gap-4 mb-5">
                    <div className="flex flex-col md:w-full w-auto">
                      <div className="flex flex-col bg-gray-400 rounded-md">
                        <h2 className="text-lg px-2 py-0.5 text-white">
                          Suara Sah
                        </h2>
                      </div>
                      <div className="flex flex-col w-full">
                        <input
                          className="px-4 h-12 w-full text-gray-600  rounded-xl bg-gray-100"
                          value={suaraSah}
                          disabled
                        />
                      </div>
                    </div>
                    <div className="flex flex-col w-full">
                      <div className="flex flex-col bg-gray-400 rounded-md">
                        <h2 className="text-lg px-2 py-0.5 text-white">
                          Suara Tidak Sah
                        </h2>
                      </div>
                      <div className="flex flex-col w-full ">
                        <input
                          className="px-4 h-12 w-full text-gray-600  rounded-xl bg-gray-100"
                          value={suaraTidakSah}
                          onChange={handleChangeSuaraTidakSah}
                        />
                      </div>
                    </div>
                  </div>

                  {loading ? (
                    <div className="w-full flex flex-row mt-8 justify-center  bg-gray-300 py-4 items-center rounded-xl cursor-pointer">
                      <CircularProgress sx={{ color: "#ffffff" }} size={25} />
                      <h1 className="text-white text-xl font-semibold pl-2">
                        Loading
                      </h1>
                    </div>
                  ) : (
                    <div
                      className="w-full flex flex-col mt-8 bg-primary py-4 items-center rounded-xl cursor-pointer"
                      onClick={handleSubmit}
                    >
                      <h1 className="text-white text-xl font-semibold">
                        Submit
                      </h1>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}

        <div className="flex flex-col bg-primary w-full absolute -z-20 h-64 xl:h-52" />

        <Sidebar expanded={expanded} setExpanded={setExpanded} />

        <div
          className={`${
            expanded ? "xl:pl-72" : "xl:pl-28"
          } flex transition-all duration-300 py-4 z-[10]  w-full h-screen`}
        >
          <div className="flex flex-col w-full">
            <HeaderAdmin
              expanded={expanded}
              setExpanded={setExpanded}
              title="TPS"
              user={userDetail}
              allVotes={allVotes ? allVotes : []}
            />

            <div className="flex pr-4"></div>

            <div ref={componentRef}>
              <div className="px-6 pt-8">
                <h1 className="text-2xl font-semibold text-primary">
                  Data Informasi TPS
                </h1>
                <h1 className="text-3xl font-semibold">Kota Banda Aceh</h1>
              </div>

              <div className="flex flex-col w-full px-6 pt-6">
                <StickyHeadTable
                  data={listDataTPS ? listDataTPS : []}
                  kecamatan
                  kelurahan
                  tps
                  admin
                  disableTableNavigation
                  setIsOpenModalEdit={setIsOpenModalEdit}
                  setPaslon1={setPaslon1}
                  setPaslon2={setPaslon2}
                  setPaslon3={setPaslon3}
                  setPaslon4={setPaslon4}
                  setSuaraSah={setSuaraSah}
                  setSuaraTidakSah={setSuaraTidakSah}
                />
              </div>

            </div>

            <div className="flex flex-row w-full justify-center px-8 pt-6">
              <div className="flex flex-col w-full md:w-auto">
                <div
                  className="border-[2px] px-12 border-primary cursor-pointer py-3 flex flex-row w-full justify-center rounded-xl gap-2"
                  onClick={handlePrint}
                >
                  <MdLocalPrintshop size={24} className="text-primary" />
                  <h1 className="text-primary text-lg">Cetak</h1>
                </div>
              </div>
            </div>

            <RunningText
              totalSuara={allVotes ? allVotes.total_suara : 0}
              persentase={allVotes ? allVotes.persentase : 0}
            />
            <Footer />
          </div>
        </div>
      </div>
    </>
  );
}
