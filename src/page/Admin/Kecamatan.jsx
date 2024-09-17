import Sidebar from "../../components/Sidebar";
import { useState, useEffect } from "react";
import Search from "../../components/Search";
import { useParams, useNavigate } from "react-router-dom";
import { Pie, Bar } from "react-chartjs-2";
import { parseToken } from "../../utils/parseToken";
import Cookies from "js-cookie";
import { calculatePercentages } from "../../utils/countPercentage";
import { pieOptions } from "../../utils/config";
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
import PercentageVote from '../../components/PercentageVote';


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


  const chartData = {
    labels: ["Paslon1", "Paslon2", "Paslon3", "Paslon4", "Suara Tidak Sah"],
    datasets: [
      {
        label: "Total Suara",
        data: data
          ? [
              data.paslon1,
              data.paslon2,
              data.paslon3,
              data.paslon4,
              data.suara_tidak_sah,
            ]
          : [0, 0, 0, 0, 0],
        backgroundColor: [
          "#775DD0",
          "#00E396",
          "#FFB01A",
          "#FF4560",
          "#4BC0C0",
          "#FF9F40",
          "#C9CBCF",
          "#FF5733",
        ],
      },
    ],
  };

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
        setData(data.payload);

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

        AlertError({
          title:
          error.message === "Sesi Anda Berakhir"
          ? "Waktu Habis"
          : "Terjadi Kesalahan",
          text: error.message,
        })

        if (error.message === "Sesi Anda Berakhir"){
          clearAllCookies()
          navigate("/login")
        }
      }
        
      );
  }, [navigate, kecamatan, kelurahan, tps, apiUrl]);

  // Opsi chart
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    borderRadius: 12,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        grid: {
          drawBorder: false,
          display: true,
          drawOnChartArea: true,
          drawTicks: false,
          borderDash: [5, 5],
        },
        border: {
          display: false, // Menghilangkan garis sumbu Y
        },
        ticks: {
          padding: 10,
          color: "#9ca2b7",
          font: {
            size: 11,
            style: "normal",
            lineHeight: 2,
          },
        },
        beginAtZero: true,
      },
      x: {
        grid: {
          drawBorder: false,
          display: false,
          drawOnChartArea: true,
          drawTicks: true,
        },
        ticks: {
          // display: true,
          color: "#9ca2b7",
          padding: 10,
          font: {
            size: 12,
            style: "normal",
            lineHeight: 2,
          },
        },
      },
    },
  };

  chartOptions.plugins = {
    ...chartOptions.plugins,
    datalabels: {
      color: "#000",
      anchor: "end",
      align: "top",
      offset: 4,
      font: {
        weight: "bold",
        size: 16,
      },
      formatter: (value) => value.toLocaleString(), // Format numbers with commas
    },
  };

  return (
    <div className="flex flex-row h-full w-full">
      <div className="flex flex-col bg-primary w-full absolute -z-20 h-52" />

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
            <Search kecamatan={kecamatan} kelurahan={kelurahan} tps={tps} admin/>
          </div>
    

          <Breadcrumbs
            valueKecamatan={data.kecamatan_name}
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
              </h1>
              <div className="xl:hidden flex flex-col w-full pt-4">
          <div className="bg-slate-100 w-full flex flex-col items-center px-2 py-4 rounded-xl"> 
            <PercentageVote allVotes={allVotes} />
          </div>
        </div>
          </div>
          <div className="flex flex-row w-full pt-12 px-12 h-[500px]">
            <div className="flex flex-col w-full lg:w-1/2 h-[90%]">
              <Pie data={chartData} options={pieOptions} />
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
