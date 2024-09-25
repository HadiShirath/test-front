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
import { HiMail } from "react-icons/hi";
import { MdRefresh } from "react-icons/md";

export default function Inbox() {
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
    fetch(`${apiUrl}/messages/inbox`, {
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

  const handleRefresh = () => {
    fetch(`${apiUrl}/messages/inbox`, {
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
            title="Pesan Masuk"
            user={userDetail}
            allVotes={allVotes}
          />

          <div className="flex pr-4"></div>

          <div className="px-6 pt-8">
            <div className="flex flex-row w-full items-center justify-between">
              <div className="flex flex-row">
                <HiMail size={60} className="text-yellow-500 mr-3" />

                <div className="flex flex-col">
                  <h1 className="text-2xl font-semibold text-primary">
                    Data Pesan SMS Masuk
                  </h1>
                  <h1 className="text-2xl xl:text-3xl font-semibold">
                    Kamar Hitung
                  </h1>
                </div>
              </div>

              <div
                className="relative hidden md:flex flex-col items-center justify-center rounded-full hover:bg-gray-100 w-12 h-12 cursor-pointer group"
                onClick={handleRefresh}
              >
                <MdRefresh size={35} className="text-gray-500" />
                <span className="absolute left-[-4.5rem] text-lg text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  Refresh
                </span>
              </div>
            </div>

            <div
              className="relative md:hidden flex flex-row items-center justify-center rounded-xl mt-4 py-3 bg-gray-100 cursor-pointer group"
              onClick={handleRefresh}
            >
              <MdRefresh size={35} className="text-gray-500" />
              <h1 className="text-xl text-gray-600 pl-2">Refresh</h1>
            </div>

            <div className="flex flex-col w-full pt-6">
              <TableListMessage data={dataMessage ? dataMessage : []} inbox />
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
