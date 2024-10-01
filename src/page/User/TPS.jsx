import Footer from "../../components/Footer";
import RunningText from "../../components/RunningText";
import { Pie, Bar } from "react-chartjs-2";
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
import { pieOptions, chartOptions } from "../../utils/configChart";
import Search from "../../components/Search";
import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import Cookies from "js-cookie";
import { parseToken } from "../../utils/parseToken";
import { IoDocumentText } from "react-icons/io5";
import Header from "../../components/Header";
import Breadcrumbs from "../../components/Breadcrumbs";
import CandidateVotes from "../../components/CandidateVotes";
import { calculatePercentages } from "../../utils/countPercentage";
import { clearAllCookies } from "../../utils/cookies";
import { AlertError } from "../../utils/customAlert";
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

export default function TPS() {
  const { kecamatan, kelurahan, tps } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState("");
  const [dataVoter, setDataVoter] = useState("");
  const [userDetail, setUserDetail] = useState("");
  const [percentage, setPercentage] = useState([]);
  const [allVotes, setAllVotes] = useState("");

  const location = useLocation();
  const currentURL = location.pathname;

  const apiUrl = import.meta.env.VITE_API_URL;

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

      if (data.role !== "user") {
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
      .then((response) => {
        if (response.status === 401) {
          throw new Error("Sesi Anda Berakhir");
        }

        return response.json();
      })
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
  }, [navigate, kecamatan, kelurahan, tps, currentURL, apiUrl]);

  const handleToPagePhoto = (event) => {
    event.preventDefault();
    navigate(`${currentURL}/photo`);
  };

  return (
    <div className="flex flex-col items-center w-full">
      <div className="flex flex-col w-full">
        <Header user={userDetail} />

        <div>
          <Search kecamatan={kecamatan} kelurahan={kelurahan} tps={tps} />

          <div className="md:px-6">
            <Breadcrumbs
              valueKecamatan={data.kecamatan_name}
              valueKelurahan={data.kelurahan_name}
              valueTps={data.tps_name}
            />
          </div>

          <div className="flex flex-row w-full justify-between px-6 md:px-12">
            <div>
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
                <span className="font-bold">
                  {data ? data.tps_name : "TPS"}
                </span>
              </h1>
            </div>

            <div className="hidden md:flex bg-gray-100 h-full p-4 items-center rounded-2xl">
              <h2 className="text-xl">
                Data Masuk :{" "}
                <span className="font-bold text-2xl">
                  {allVotes.persentase}%
                </span>{" "}
                ({allVotes.total_suara} Suara)
              </h2>
            </div>
          </div>

          <div className="flex md:hidden w-full px-4 mt-4">
            <div className="bg-slate-100 w-full p-4 rounded-2xl">
              <h2 className="text-xl">
                Data Masuk :{" "}
                <span className="font-bold text-2xl">
                  {allVotes.persentase}%
                </span>{" "}
                ({allVotes.total_suara} Suara)
              </h2>
            </div>
          </div>

          <div className="flex flex-row w-full px-12 pt-12 h-[500px]">
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
        </div>

        <div className="hidden md:flex flex-row w-full items-center justify-center pt-8 gap-2 px-4">
          <div
            className="hidden md:flex flex-row border-primary border-[3px] py-4 px-8 gap-2 items-center rounded-xl cursor-pointer"
            onClick={handleToPagePhoto}
          >
            <IoDocumentText size={24} className="text-primary" />
            <h1 className="text-primary text-lg">Foto Form C1</h1>
          </div>
        </div>
      </div>

      <div className="md:hidden flex flex-col w-full pt-4">
        <div className="flex flex-row mt-2 px-8 items-center">
          <div
            className="border-[2px] border-primary py-3 flex flex-row w-full justify-center rounded-xl gap-2 cursor-pointer"
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
  );
}
