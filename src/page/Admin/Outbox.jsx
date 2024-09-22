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

export default function Outbox() {
  const { kecamatan, kelurahan, tps } = useParams();
  const [expanded, setExpanded] = useState(true);
  const navigate = useNavigate();
  const [userDetail, setUserDetail] = useState("");
  const [allVotes, setAllVotes] = useState("");
  const [dataMessage, setDataMessage] = useState([]);

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
      .catch((error) => {
        if (error.message === "Sesi Anda Berakhir") {
          clearAllCookies();
          navigate("/login");
        }
      });
  }, [navigate, kecamatan, kelurahan, tps, apiUrl]);

  useEffect(() => {
    fetch(`${apiUrl}/message/outbox`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setDataMessage(data.payload);
      });
  }, [token, apiUrl]);

  return (
    <div className="flex flex-row h-full w-full relative">
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

              <div
                className="hidden xl:flex bg-orange-400 rounded-xl cursor-pointer"
                onClick={() => alert("haha")}
              >
                <div className="flex flex-row items-center  p-2 px-8">
                  <FaPlus size={20} className="text-white" />
                  <h1 className="text-white text-xl pl-2">Kirim Pesan</h1>
                </div>
              </div>
            </div>

            <div
              className="xl:hidden flex flex-col w-full items-center mt-4 bg-orange-400 rounded-xl cursor-pointer"
              onClick={() => alert("haha")}
            >
              <div className="flex flex-row items-center  p-2 px-8">
                <FaPlus size={20} className="text-white" />
                <h1 className="text-white text-xl pl-2">Kirim Pesan</h1>
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
