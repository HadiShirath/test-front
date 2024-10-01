/* eslint-disable react/prop-types */
import Sidebar from "../../components/Sidebar";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { parseToken } from "../../utils/parseToken";
import Cookies from "js-cookie";
import Footer from "../../components/Footer";
import RunningText from "../../components/RunningText";
import HeaderAdmin from "../../components/HeaderAdmin";
import { AlertError } from "../../utils/customAlert";
import { clearAllCookies } from "../../utils/cookies";
import TableListMessage from "../../components/TableListMessage";
import { FaPlus } from "react-icons/fa";
import { HiMailOpen } from "react-icons/hi";
import { motion } from "framer-motion";
import { FiX } from "react-icons/fi";
import { IoSend } from "react-icons/io5";
import CircularProgress from "@mui/material/CircularProgress";
import Swal from "sweetalert2";
import { AlertWarning } from "../../utils/customAlert";
import MultipleSelectChip from "../../components/atoms/MultipleSelectChip";
import { MdOutgoingMail, MdRefresh } from "react-icons/md";
import { Checkbox } from "@mui/material";

export default function Outbox() {
  const { kecamatan, kelurahan, tps } = useParams();
  const [expanded, setExpanded] = useState(true);
  const navigate = useNavigate();
  const [userDetail, setUserDetail] = useState("");
  const [allVotes, setAllVotes] = useState("");
  const [dataMessage, setDataMessage] = useState([]);
  const [isOpenModalEdit, setIsOpenModalEdit] = useState(false);
  const [loading, setLoading] = useState(false);
  const [receiverNumber, setReceiverNumber] = useState([]);
  const [message, setMessage] = useState("");
  const [listNumber, setListNumber] = useState([]);
  const [isNumberKecamatan, setIsNumberKecamatan] = useState(false);
  const [personName, setPersonName] = useState([]);

  const apiUrl = import.meta.env.VITE_API_URL;
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
      })
      .catch((error) => {
        if (error.message === "Sesi Anda Berakhir") {
          clearAllCookies();
          navigate("/login");
        }
      });
  }, [navigate, kecamatan, kelurahan, tps, apiUrl]);

  useEffect(() => {
    fetch(`${apiUrl}/messages/outbox`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setDataMessage(data.payload);
      });

    fetch(`${apiUrl}/users`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setListNumber(data.payload);
      });
  }, [token, apiUrl]);

  const handleCloseModal = () => {
    handleRemoveData()
    setIsOpenModalEdit(!isOpenModalEdit);
  };

  const handleRemoveData = () => {
    setReceiverNumber("");
    setPersonName("");
    setMessage("");
  };

  const handleSubmit = () => {
    setLoading(true);

    if (receiverNumber.length > 0 && message) {
      if (receiverNumber.length === 1) {
        const payload = {
          receiver_number: receiverNumber[0],
          message: message,
          processed: false,
        };

        fetch(`${apiUrl}/messages/outbox`, {
          method: "POST",
          body: JSON.stringify(payload),
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
                text: "Berhasil mengirim SMS",
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
      } else {
        const payload = {
          receiver_numbers: receiverNumber,
          message: message,
          processed: false,
        };

        fetch(`${apiUrl}/messages/outboxs`, {
          method: "POST",
          body: JSON.stringify(payload),
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
                text: "Berhasil mengirim SMS",
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
    } else {
      setLoading(false);
      AlertWarning({
        title: "Data Kosong",
        text: "Nomor HP dan isi pesan tidak boleh kosong",
      });
    }
  };

  const handleChangeMessage = (event) => {
    setMessage(event.target.value);
  };

  const handleRefresh = () => {
    fetch(`${apiUrl}/messages/outbox`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setDataMessage(data.payload);
      });
  };

  const handleCheckbox = (event) => {
    setIsNumberKecamatan(event.target.checked);

    handleRemoveData()
  };
  

  return (
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
            <div className="flex flex-row bg-white rounded-3xl mx-6 p-12 md:p-16 ">
              <div
                className="absolute right-12 cursor-pointer md:px-4 top-8"
                onClick={handleCloseModal}
              >
                <FiX size={24} />
              </div>

              <div className="flex flex-col w-full xl:w-96">
                <div className="flex flex-row">
                  <MdOutgoingMail size={60} className="text-orange-400" />
                  <div className="pl-3">
                    <h1 className="text-3xl font-semibold">Kirim SMS</h1>
                    <h1 className="text-lg text-gray-500">
                      Kirim pesan SMS ke nomor HP
                    </h1>
                  </div>
                </div>

                <h1 className="text-xl pt-6">Kepada :</h1>
                <div className="pt-4 w-full">
                  <MultipleSelectChip
                    data={listNumber}
                    personName={personName ? personName : []}
                    setPersonName={setPersonName}
                    setValue={setReceiverNumber}
                    isNumberKecamatan={isNumberKecamatan}
                  />
                </div>

                <div className="flex flex-row justify-end">
                  <Checkbox
                    checked={isNumberKecamatan}
                    onChange={handleCheckbox}
                  />
                  <h1 className="text-gray-400 pt-2">Berdasarkan Kecamatan</h1>
                </div>
                <h1 className="text-xl pt-2 xl:pt-4">Pesan :</h1>
                <div className="pt-2 xl:pt-5 w-full">
                  <textarea
                    className="flex flex-col w-full items-start py-5 justify-start bg-gray-100 px-4 rounded-xl text-md h-16"
                    value={message}
                    onChange={handleChangeMessage}
                    placeholder="Masukan pesan"
                    style={{
                      width: "100%",
                      resize: "vertical",
                      padding: "10px",
                    }}
                  />
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
                    <div className="flex flex-row items-center justify-center w-full">
                      <h1 className="text-white text-xl font-semibold pr-4">
                        Kirim
                      </h1>
                      <IoSend size={20} className="text-white" />
                    </div>
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
            title="Pesan Keluar"
            user={userDetail}
            allVotes={allVotes}
          />

          <div className="flex pr-4"></div>

          <div className="px-6 pr-8 pt-8">
            <div className="flex flex-row w-full justify-between items-center">
              <div className="flex flex-row">
                <HiMailOpen size={60} className="text-red-500 mr-3" />

                <div className="flex flex-col">
                  <h1 className="text-2xl font-semibold text-primary">
                    Data Pesan SMS Keluar
                  </h1>
                  <h1 className="text-2xl xl:text-3xl font-semibold">
                    Kamar Hitung
                  </h1>
                </div>
              </div>

              <div className="flex flex-row">
                <div
                  className="hidden xl:flex bg-orange-400 rounded-xl cursor-pointer"
                  onClick={() => setIsOpenModalEdit(!isOpenModalEdit)}
                >
                  <div className="flex flex-row items-center py-2 px-8">
                    <FaPlus size={20} className="text-white" />
                    <h1 className="text-white text-xl pl-2">Kirim Pesan</h1>
                  </div>
                </div>
                <div
                  className="relative hidden md:flex flex-col items-center justify-center rounded-full hover:bg-gray-100 p-2 ml-2 cursor-pointer group"
                  onClick={handleRefresh}
                >
                  <MdRefresh size={35} className="text-gray-500" />
                </div>
              </div>
            </div>

            <div className="xl:hidden flex flex-row items-center mt-6">
              <div
                className="flex flex-col w-full items-center bg-orange-400 rounded-xl cursor-pointer"
                onClick={() => setIsOpenModalEdit(!isOpenModalEdit)}
              >
                <div className="flex flex-row items-center  p-2 px-8">
                  <FaPlus size={20} className="text-white" />
                  <h1 className="text-white text-xl pl-2">Kirim Pesan</h1>
                </div>
              </div>

              <div
                className="flex flex-colbg-gray-100 ml-2 cursor-pointer"
                onClick={handleRefresh}
              >
                <MdRefresh size={35} className="text-gray-500" />
              </div>
            </div>

            <div className="flex flex-col w-full pt-6">
              <TableListMessage data={dataMessage ? dataMessage : []} outbox />
            </div>
          </div>

          <RunningText
            totalSuara={allVotes.total_suara}
            persentase={allVotes.persentase}
          />
          <Footer />
        </div>
      </div>
    </div>
  );
}
