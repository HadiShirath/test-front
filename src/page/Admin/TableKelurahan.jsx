import Sidebar from "../../components/Sidebar";
import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { parseToken } from "../../utils/parseToken";
import Cookies from "js-cookie";
import { calculatePercentages } from "../../utils/countPercentage";
import CandidateVotes from "../../components/CandidateVotes";
import Footer from "../../components/Footer";
import RunningText from "../../components/RunningText";
import HeaderAdmin from "../../components/HeaderAdmin";
import StickyHeadTable from "../../components/StickyHeadTable";
import Breadcrumbs from "../../components/Breadcrumbs";
import { clearAllCookies } from "../../utils/cookies";
import { AlertError } from "../../utils/customAlert";
import { MdLocalPrintshop } from "react-icons/md";
import { useReactToPrint } from "react-to-print";

export default function TableKelurahan() {
  const { kecamatan, kelurahan, tps } = useParams();
  const [expanded, setExpanded] = useState(true);
  const navigate = useNavigate();
  const [dataVoter, setDataVoter] = useState({});
  const [percentage, setPercentage] = useState([]);
  const [userDetail, setUserDetail] = useState("");
  const [listKelurahan, setListKelurahan] = useState("");
  const [valueKecamatan, setValueKecamatan] = useState("");
  const [allVotes, setAllVotes] = useState("");

  const componentRef = useRef();

  const apiUrl = import.meta.env.VITE_API_URL;

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

    fetch(`${apiUrl}/kecamatan/${kecamatan}`, {
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
        setListKelurahan(data.payload);
        setValueKecamatan(data.payload[0].kecamatan_name);
      })
      .catch((error) => {
        if (error.message === "Sesi Anda Berakhir") {
          clearAllCookies();
          navigate("/login");
        }
      });

    fetch(`${apiUrl}/kecamatan/voter/${kecamatan}`, {
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

        // percentage paslon tanpa suara tidak sah
        const percentages = calculatePercentages(dataset.slice(0, 4));

        setDataVoter(dataset);
        setPercentage(percentages);
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
              <h1 className="text-2xl xl:text-4xl font-semibold">
                Kecamatan <span className="font-bold">{valueKecamatan}</span>
              </h1>
            </div>

            <div className="flex pt-4">
              <Breadcrumbs valueKecamatan={valueKecamatan} table admin />
            </div>

            <div className="flex flex-col w-full px-6 pt-2">
              <StickyHeadTable
                data={listKelurahan ? listKelurahan : []}
                kecamatan={kecamatan}
                kelurahan
              />
            </div>
            <CandidateVotes percentage={percentage} dataVoter={dataVoter} />
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
            totalSuara={allVotes.total_suara}
            persentase={allVotes.persentase}
          />
          <Footer />
        </div>
      </div>
    </div>
  );
}
