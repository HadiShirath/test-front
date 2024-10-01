import Sidebar from "../../components/Sidebar";
import { useState, useEffect } from "react";
import Search from "../../components/Search";
import { useParams, useNavigate } from "react-router-dom";
import { Pie, Bar } from "react-chartjs-2";
import { parseToken } from "../../utils/parseToken";
import Cookies from "js-cookie";
import { calculatePercentages } from "../../utils/countPercentage";
import { pieOptions, chartOptions } from "../../utils/configChart";
import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import CandidateVotes from "../../components/CandidateVotes";
import Footer from "../../components/Footer";
import RunningText from "../../components/RunningText";
import Breadcrumbs from "../../components/Breadcrumbs";
import HeaderAdmin from "../../components/HeaderAdmin";
import { clearAllCookies } from "../../utils/cookies";
import { AlertError } from "../../utils/customAlert";
import PercentageVote from "../../components/PercentageVote";
import { IoDocumentText } from "react-icons/io5";
import { formatChartData, formatPieData } from "../../data/formatDataChart";

// Register komponen Chart.js yang diperlukan
ChartJS.register(
  CategoryScale,
  ArcElement,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function Beranda() {
  const { kecamatan, kelurahan, tps } = useParams();
  const [expanded, setExpanded] = useState(true);
  const [data, setData] = useState("");
  const navigate = useNavigate();
  const [dataVoter, setDataVoter] = useState({});
  const [percentage, setPercentage] = useState([]);
  const [userDetail, setUserDetail] = useState("");
  const [allVotes, setAllVotes] = useState("");

  const apiUrl = import.meta.env.VITE_API_URL;

  // Dapatkan data chart
  const chartData = formatChartData(data);
  const pieData = formatPieData(data);

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

    fetch(`${apiUrl}/tps/voter/${tps}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setData(data.payload);

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
      })
      .catch((error) => {
        if (error.message === "Sesi Anda Berakhir") {
          clearAllCookies();
          navigate("/login");
        }
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

  const handleToPagePhoto = (event) => {
    event.preventDefault();
    navigate(`/admin/dashboard/${kecamatan}/${kelurahan}/${tps}/photo`);
  };

  return (
    <div className="flex flex-row h-full w-full">
      <div className="flex flex-col bg-primary w-full absolute -z-20 h-64 xl:h-52" />

      <Sidebar expanded={expanded} setExpanded={setExpanded} />

      <div
        className={`${
          expanded ? "xl:pl-72" : "xl:pl-28"
        } flex flex-col transition-all duration-300 py-4 z-[10]  w-full h-screen`}
      >
        <div className="flex flex-col w-full">
          <HeaderAdmin
            expanded={expanded}
            setExpanded={setExpanded}
            title="Dashboard"
            user={userDetail}
            allVotes={allVotes}
          />

          <div className="flex xl:pr-4 pt-4 xl:pt-6">
            <Search
              kecamatan={kecamatan}
              kelurahan={kelurahan}
              tps={tps}
              admin
            />
          </div>
          <Breadcrumbs
            valueKecamatan={data.kecamatan_name}
            valueKelurahan={data.kelurahan_name}
            valueTps={data.tps_name}
            admin
          />

          <div className="px-6">
            <h1 className="text-2xl font-semibold text-primary">
              Grafik Perolehan Suara
            </h1>
            <h1 className="text-3xl font-semibold">
              Kecamatan{" "}
              <span className="font-bold">
                {data ? data.kecamatan_name : null}
              </span>{" "}
              Kelurahan{" "}
              <span className="font-bold">
                {data ? data.kelurahan_name : null}
              </span>{" "}
              <span className="font-bold">{data ? data.tps_name : "TPS"}</span>
            </h1>

            <div className="xl:hidden flex flex-col w-full pt-4">
              <div className="bg-slate-100 w-full flex flex-col items-center px-2 py-4 rounded-xl">
                <PercentageVote allVotes={allVotes} />
              </div>
            </div>
          </div>
          <div className="flex flex-row w-full pt-12 px-12 h-[500px]">
            <div className="flex flex-col w-full lg:w-1/2 h-[90%]">
              <Pie data={pieData} options={pieOptions} />
            </div>

            <div className="hidden lg:flex flex-col w-full h-full z-10">
              <Bar
                data={chartData}
                options={chartOptions}
                plugins={[ChartDataLabels]}
              />
            </div>
          </div>

          <div className="flex lg:hidden flex-col w-full h-[300px] px-4">
            <Bar
              data={chartData}
              options={chartOptions}
              plugins={[ChartDataLabels]}
            />
          </div>

          <CandidateVotes percentage={percentage} dataVoter={dataVoter} />

          <div className="flex flex-row mt-2 w-full justify-center px-8 pt-4 items-center">
            <div className="flex flex-row w-full xl:w-auto">
              <div
                className="border-[2px] border-primary py-3 px-12 flex flex-row w-full justify-center rounded-xl gap-2 cursor-pointer"
                onClick={handleToPagePhoto}
              >
                <IoDocumentText size={24} className="text-primary" />
                <h1 className="text-primary text-lg">Foto Form C1</h1>
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
