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
import { useRef, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { parseToken } from "../../utils/parseToken";
import Header from "../../components/Header";
import Breadcrumbs from "../../components/Breadcrumbs";
import CandidateVotes from "../../components/CandidateVotes";
import { calculatePercentages } from "../../utils/countPercentage";
import { clearAllCookies } from "../../utils/cookies";
import PercentageVote from "../../components/PercentageVote";
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

export default function Home() {
  const { kecamatan, kelurahan, tps } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState("");
  const [userDetail, setUserDetail] = useState("");
  const [allVotes, setAllVotes] = useState("");
  const [dataVoter, setDataVoter] = useState({});
  const [percentage, setPercentage] = useState([]);

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

    fetch(`${apiUrl}/tps/voter/all`, {
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

  const componentRef = useRef();

  const handleToPageTable = (event) => {
    event.preventDefault();
    navigate(`/user/table`);
  };

  return (
    <div className="flex flex-col items-center w-full">
      <div ref={componentRef} className="flex flex-col w-full">
        <Header user={userDetail} />

        <div>
          <Search kecamatan={kecamatan} kelurahan={kelurahan} tps={tps} />
          <div className="md:px-6">
            <Breadcrumbs
              kecamatan={data ? data.kecamatan_name : ""}
              kelurahan={data ? data.kelurahan_name : ""}
              tps={data ? data.tps_name : ""}
            />
          </div>

          <div className="flex flex-row w-full justify-between px-6 md:px-12">
            <div>
              <h1 className="text-2xl font-semibold text-primary">
                Grafik Perolehan Suara
              </h1>
              <h1 className="text-3xl font-semibold">Kabupaten Aceh Besar</h1>
            </div>

            <div className="hidden md:flex bg-gray-100 h-full p-4 items-center rounded-2xl">
              <PercentageVote allVotes={allVotes} />
            </div>
          </div>

          <div className="flex md:hidden w-full px-4 mt-4">
            <div className="bg-slate-100 w-full p-4 rounded-2xl">
              <PercentageVote allVotes={allVotes} />
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
            className="bg-primary py-4 px-8 rounded-xl cursor-pointer"
            onClick={handleToPageTable}
          >
            <h1 className="text-white text-lg">Tampilkan Tabel Suara</h1>
          </div>
        </div>
      </div>

      <div className="md:hidden flex flex-col w-full">
        <div className="flex-row mt-4  px-16 items-center">
          <div
            className="bg-primary py-3 flex flex-row justify-center rounded-xl gap-2"
            onClick={handleToPageTable}
          >
            <h1 className="text-white text-lg">Tampilkan Tabel Suara </h1>
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
