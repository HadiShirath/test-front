/* eslint-disable no-undef */
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
import { MdLocalPrintshop } from "react-icons/md";
import { pieOptions } from "../../utils/config";
import Search from "../../components/Search";
import { useRef, useEffect, useState } from "react";
import { useReactToPrint } from "react-to-print";
import PrintChart from "../../components/PrintChart";
import { useParams, useNavigate} from "react-router-dom";
import Cookies from "js-cookie";
import { parseToken } from "../../utils/parseToken";
import Swal from "sweetalert2";
import Header from "../../components/Header";
import Breadcrumbs from "../../components/Breadcrumbs";
import CandidateVotes from "../../components/CandidateVotes";
import { calculatePercentages } from "../../utils/countPercentage";
import { clearAllCookies } from '../../utils/cookies';
import PercentageVote from '../../components/PercentageVote';
import { AlertError } from '../../utils/customAlert';
import { motion } from "framer-motion";
import { slideInFromBottom, sideBar } from '../../utils/motion';
import { MdClose } from "react-icons/md";

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
  const [open, setOpen] = useState(false);

  const apiUrl = import.meta.env.VITE_API_URL;

  // Lakukan pengecekan atau logika berdasarkan parameter URL dan path

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
        const percentages = calculatePercentages(dataset);

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

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

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

  const handleToPageTable = (event) => {
    event.preventDefault();
    navigate(`/user/table`);
  };

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
    <div className="flex flex-col items-center w-full">
       {open && (
        <motion.div
          initial="offscreen"
          whileInView="onscreen"
          className="fixed md:hidden w-full h-full z-[20]"
        >
          <div className="w-full h-full" onClick={() => setOpen(!open)} />
          <motion.div
            variants={sideBar()}
            className="absolute pt-16 px-8 w-1/2 h-full shadow-primary shadow-xl right-0 top-0 bg-[#ffffff] backdrop-blur-xl"
          >
            <div className="flex justify-end" onClick={() => setOpen(!open)}>
              <MdClose size={30} />
            </div>
            <div className="flex flex-col items-center h-full justify-between py-12">
              <div className="flex flex-col gap-8">
              

                <motion.h1
                  variants={slideInFromBottom(0.5)}
                  className="text-2xl font-semibold"
                >
                 Test
                </motion.h1>
                <motion.div
                  variants={slideInFromBottom(0.7)}
                  className="flex gap-2"
                >
                  <a
                    href="https://api.whatsapp.com/send/?phone=6282323896763"
                    target="_blank"
                    aria-label="Whatsapp"
                  >
                    <img
                      src="/images/whatsapp.png"
                      alt=""
                      className="h-[30px] w-auto hover:scale-125 transition-all duration-300"
                    />
                  </a>
                  <a
                    href="https://www.instagram.com/maha.kreativa/"
                    target="_blank"
                    aria-label="Instagram"
                  >
                    <img
                      src="/images/instagram.png"
                      alt=""
                      className="h-[30px] w-auto hover:scale-125 transition-all duration-300"
                    />
                  </a>
                </motion.div>
              </div>

              <motion.h1 
                variants={slideInFromBottom(1)}
                className="text-md w-full py-2 text-white  text-center mb-8"
              >
                KamarHitung.id
              </motion.h1>
            </div>
          </motion.div>
        </motion.div>
      )}
      <div ref={componentRef} className="flex flex-col w-full">
        <Header user={userDetail} setOpen={setOpen} open={open}/>

        <div>
          <Search kecamatan={kecamatan} kelurahan={kelurahan} tps={tps} />
          <div className="md:px-6">

          <Breadcrumbs
            kecamatan={data.kecamatan_name}
            kelurahan={data.kelurahan_name}
            tps={data.tps_name}
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
        </div>

        <div className="hidden md:flex flex-row w-full items-center justify-center pt-8 gap-2 px-4">
          <div
            className="bg-primary py-4 px-8 rounded-xl cursor-pointer"
            onClick={handleToPageTable}
          >
            <h1 className="text-white text-lg">Tampilkan Tabel Suara</h1>
          </div>
          {/* <div
              className="hidden md:flex flex-row bg-primary py-4 px-8 gap-2 items-center rounded-xl cursor-pointer"
              onClick={handlePrint}
            >
              <MdLocalPrintshop size={24} className="text-white" />
              <h1 className="text-white text-lg">Cetak</h1>
            </div> */}
        </div>
      </div>

      <div className="md:hidden flex flex-col w-full">
        <div className="flex-row mt-4  px-16 items-center">

            <div className="bg-primary py-3 flex flex-row justify-center rounded-xl gap-2"  onClick={handleToPageTable}>
              <h1 className="text-white text-lg">Tampilkan Tabel Suara </h1>
            </div>

        </div>

        {/* <div className="flex flex-row mt-2  px-16 items-center">
            <div
              className="border-[2px] border-primary py-3 flex flex-row w-full justify-center rounded-xl gap-2 cursor-pointer"
              onClick={handlePrint}
            >
              <MdLocalPrintshop size={24} className="text-primary" />
              <h1 className="text-primary text-lg">Cetak</h1>
            </div>
          </div> */}
      </div>

      <div className="hidden">
        <PrintChart ref={componentRef} chartData={chartData} />
      </div>
      <RunningText
        totalSuara={allVotes.total_suara}
        persentase={allVotes.persentase}
      />
      <Footer />
    </div>
  );
}
