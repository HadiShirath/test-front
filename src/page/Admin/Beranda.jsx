import Sidebar from "../../components/Sidebar";
import { useState, useEffect, useRef } from "react";
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
import { formatChartData, formatPieData } from "../../data/formatDataChart";
import { FiUpload } from "react-icons/fi";
import CircularProgress from "@mui/material/CircularProgress";
import Swal from "sweetalert2";

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
  const [loading, setLoading] = useState(false);
  const inputRef = useRef();

  const apiUrl = import.meta.env.VITE_API_URL;
  const token = Cookies.get("access_token");

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

    fetch(`${apiUrl}/tps/voter/all`, {
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

        // tanpa suara tidak sah
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
      .then((response) => response.json())
      .then((data) => {
        setAllVotes(data.payload);
      });
  }, [navigate, kecamatan, kelurahan, tps, apiUrl]);

  const handleImageClick = () => {
    Swal.fire({
      title: "Import Data CSV",
      text: "Apakah Kamu Yakin?",
      // icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yakin",
      confirmButtonColor: "#008FFB",
      focusConfirm: false,
      cancelButtonText: "Batal",
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        inputRef.current.click();
      }
    });
  };

  const handleImportData = (event) => {
    event.preventDefault(); // Mencegah pengiriman formulir default

    setLoading(true);

    const formData = new FormData();
    var file = event.target.files[0];

    // // Cek ekstensi file
    if (file.type != "text/csv") {
      setLoading(false);
      return Swal.fire({
        title: "Import File Gagal",
        text: "Harap memilih file CSV",
        icon: "error",
        showConfirmButton: false,
        timer: 2000,
      });
    }

    if (file) {
      formData.append("file", file);

      // Mengirim file ke server
      fetch(`${apiUrl}/kecamatan/file/csv`, {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${token}`, // Ganti dengan token JWT Anda
        },
      })
        .then((response) => {
          if (response.status === 401) {
            throw new Error("Sesi Anda Berakhir");
          }
          return response.json();
        })
        .then((data) => {
          if (data.success) {
            // File is selected, update the image state
            Swal.fire({
              title: "Berhasil",
              text: "Import Data CSV Berhasil",
              icon: "success",
              showConfirmButton: false,
              timer: 2000,
            });

            setTimeout(() => {
              window.location.reload();
            }, 2000);
          } else {
            setLoading(false);

            Swal.fire({
              title: "Import Data CSV Gagal",
              text: data.error,
              icon: "error",
              showConfirmButton: false,
              timer: 2000,
            });
          }

          inputRef.current.value = "";
        })
        .catch((error) => {
          if (error.message === "Sesi Anda Berakhir") {
            clearAllCookies();
            navigate("/login");
          }
        });
    }
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
        <div className="flex flex-col w-full ">
          <HeaderAdmin
            expanded={expanded}
            setExpanded={setExpanded}
            title="Dashboard"
            user={userDetail}
            allVotes={allVotes ? allVotes : []}
          />
          <div className="flex xl:pr-4 pt-4 xl:pt-6">
            <Search
              kecamatan={kecamatan}
              kelurahan={kelurahan}
              tps={tps}
              admin
            />
          </div>
          <Breadcrumbs admin />

          <div className="px-6">
            <div className="flex flex-row w-full justify-between">
              <div>
                <h1 className="text-2xl font-semibold text-primary">
                  Grafik Perolehan Suara
                </h1>
                <h1 className="text-3xl font-semibold">Kota Banda Aceh</h1>
              </div>

              <form id="uploadFileCSV" encType="multipart/form-data">
                <input
                  type="file"
                  accept="text/csv"
                  ref={inputRef}
                  onChange={handleImportData}
                  style={{ display: "none" }}
                />
              </form>

              <div>
                {loading ? (
                  <div className="hidden md:flex flex-row m-2 border-[2px] border-gray-300 rounded-xl cursor-pointer p-4 px-10">
                    <CircularProgress sx={{ color: "#d1d5db" }} size={25} />
                    <h1 className="text-gray-300 text-xl font-semibold pl-2">
                      Loading
                    </h1>
                  </div>
                ) : (
                  <div
                    className="hidden md:flex flex-row m-2 border-[2px] border-orange-400 rounded-xl cursor-pointer p-4 px-10"
                    onClick={handleImageClick}
                  >
                    <FiUpload size={24} className="text-orange-400" />
                    <h1 className="text-xl text-orange-400 pl-2">Import CSV</h1>
                  </div>
                )}
              </div>
            </div>

            <div className="md:hidden flex flex-row justify-center w-full pt-4">
              {loading ? (
                <div className="border-[2px] border-gray-300 w-full flex flex-row justify-center px-2 py-4 rounded-xl">
                  <CircularProgress sx={{ color: "#d1d5db" }} size={25} />
                  <h1 className="text-gray-300 text-xl font-semibold pl-2">
                    Loading
                  </h1>
                </div>
              ) : (
                <div
                  className="border-[2px] border-orange-400 w-full flex flex-row justify-center px-2 py-4 rounded-xl"
                  onClick={handleImageClick}
                >
                  <FiUpload size={24} className="text-orange-400" />
                  <h1 className="text-xl text-orange-400 pl-2">Import CSV</h1>
                </div>
              )}
            </div>

            <div className="xl:hidden flex flex-col w-full pt-4">
              <div className="bg-slate-100 w-full flex flex-col items-center px-2 py-4 rounded-xl">
                <PercentageVote allVotes={allVotes ? allVotes : []} />
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
          <RunningText
            totalSuara={allVotes ? allVotes.total_suara : 0}
            persentase={allVotes ? allVotes.persentase : 0}
          />
          <Footer />
        </div>
      </div>
    </div>
  );
}
