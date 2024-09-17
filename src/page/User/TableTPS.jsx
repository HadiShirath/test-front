import RunningText from "../../components/RunningText";
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
import { MdLocalPrintshop } from "react-icons/md";

import { useParams, useNavigate, useLocation} from "react-router-dom";
import StickyHeadTable from "../../components/StickyHeadTable";
import Breadcrumbs from "../../components/Breadcrumbs";
import Header from "../../components/Header";
import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { parseToken } from "../../utils/parseToken";
import Swal from "sweetalert2";
import Footer from "../../components/Footer";
import { calculatePercentages } from "../../utils/countPercentage";
import CandidateVotes from '../../components/CandidateVotes';
import PercentageVote from '../../components/PercentageVote';
import { clearAllCookies } from '../../utils/cookies';
import { AlertError } from '../../utils/customAlert';

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

export default function Table() {
  const { kelurahan } = useParams();
  const navigate = useNavigate();
  const [userDetail, setUserDetail] = useState("");
  const [listTPS, setListTPS] = useState([]);
  const [valueKecamatan, setValueKecamatan] = useState([]);
  const [valueKelurahan, setValueKelurahan] = useState([]);
  const [dataVoter, setDataVoter] = useState({});
  const [percentage, setPercentage] = useState([]);
  const [allVotes, setAllVotes] = useState("");

  const location = useLocation();
  const currentPath = location.pathname;

  const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const token = Cookies.get("access_token");
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

    fetch(`${apiUrl}/kelurahan/${kelurahan}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setListTPS(data.payload);
        setValueKecamatan(data.payload[0].kecamatan_name);
        setValueKelurahan(data.payload[0].kelurahan_name);
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

    fetch(`${apiUrl}/kelurahan/voter/${kelurahan}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
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
        Swal.fire({
          title: "Terjadi Kesalahan",
          text: error,
          icon: "error",
          showConfirmButton: false,
          timer: 2000,
        })
      );

      fetch(`${apiUrl}/kecamatan`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          setAllVotes(data.payload);
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
  }, [navigate, kelurahan, apiUrl]);

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
          display: false,
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

  const handleToPageGraphic = (event) => {
    event.preventDefault();

    const result = currentPath.replace("/table", "");
    navigate(`${result}`);
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
      formatter: (value) => value.toLocaleString(),
    },
  };

  return (
    <div className="flex flex-col w-full">
      <Header user={userDetail} />

      <div className="pt-12">

      <div className="xl:hidden flex">
          <Breadcrumbs
            valueKecamatan={valueKecamatan}
            valueKelurahan={valueKelurahan}
            table
          />
        </div>

        <div className="flex flex-row w-full justify-between px-6 md:px-12">
          <div className="xl:max-w-[1000px]">
            <h1 className="text-2xl font-semibold text-primary">
              Tabel Perolehan Suara
            </h1>

            <h1 className="text-2xl xl:text-4xl font-semibold">
              Kecamatan <span className="font-bold">{valueKecamatan}</span>{" "}
              Kelurahan <span className="font-bold">{valueKelurahan}</span>
            </h1>
          </div>

        

          <div className="hidden md:flex bg-gray-100 h-full p-4 mt-4 items-center rounded-2xl">
          <PercentageVote allVotes={allVotes} /> 
          </div>
        </div>

        <div className="hidden xl:flex pt-4 px-6">
          <Breadcrumbs
            valueKecamatan={valueKecamatan}
            valueKelurahan={valueKelurahan}
            table
          />
        </div>

      

        <div className="flex md:hidden w-full px-4 my-4">
          <div className="bg-slate-100 w-full p-4 rounded-2xl">
          <PercentageVote allVotes={allVotes} /> 
          </div>
        </div>

        <div className="flex flex-col w-full px-4 md:px-12">
          <StickyHeadTable data={listTPS} tps />
        </div>

        <CandidateVotes percentage={percentage} dataVoter={dataVoter} />

        <div className="hidden md:flex flex-row w-full justify-center pt-8 gap-2 px-4 ">

            <div className="bg-primary py-4 px-8 rounded-xl cursor-pointer" onClick={handleToPageGraphic}>
              <h1 className="text-white text-lg">Tampilkan Bentuk Grafik</h1>
            </div>
          {/* <div className="hidden md:flex flex-row bg-primary py-4 px-8 gap-2 items-center rounded-xl">
          <MdLocalPrintshop size={24} className="text-white" />
          <h1 className="text-white text-lg">Cetak</h1>
        </div> */}
        </div>

        <div className="md:hidden flex flex-col w-full">
          <div className="flex-row mt-4  px-16 items-center">

              <div className="bg-primary py-3 flex flex-row justify-center rounded-xl gap-2" onClick={handleToPageGraphic}>
                <h1 className="text-white text-lg">Tampilkan Bentuk Grafik</h1>
              </div>
          </div>

          {/* <div className="flex flex-row mt-2  px-16 items-center">
            <div className="border-[2px] border-primary py-3 flex flex-row w-full justify-center rounded-xl gap-2">
              <MdLocalPrintshop size={24} className="text-primary" />
              <h1 className="text-primary text-lg">Cetak</h1>
            </div>
          </div> */}
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
