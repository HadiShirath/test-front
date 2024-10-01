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
import { AlertError } from "../../utils/customAlert";
import { clearAllCookies } from "../../utils/cookies";
import { MdLocalPrintshop } from "react-icons/md";
import { useReactToPrint } from "react-to-print";
import { FiUpload } from "react-icons/fi";
import Swal from "sweetalert2";
import CircularProgress from "@mui/material/CircularProgress";

export default function TableKecamatan() {
  const { kecamatan, kelurahan, tps } = useParams();
  const [expanded, setExpanded] = useState(true);
  const navigate = useNavigate();
  const [dataVoter, setDataVoter] = useState({});
  const [percentage, setPercentage] = useState([]);
  const [userDetail, setUserDetail] = useState("");
  const [listKecamatan, setListKecamatan] = useState("");
  const [allVotes, setAllVotes] = useState("");
  const [loading, setLoading] = useState(false);
  const inputRef = useRef();

  const componentRef = useRef(null);

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

    fetch(`${apiUrl}/kecamatan/all`, {
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
        setListKecamatan(data.payload);
      })
      .catch((error) => {
        if (error.message === "Sesi Anda Berakhir") {
          clearAllCookies();
          navigate("/login");
        }
      });

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

          inputRef.current.value = '';
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
            allVotes={allVotes ? allVotes : []}
          />

          <div className="flex pr-4"></div>

          <div ref={componentRef}>
            <div className="flex flex-row justify-between px-6 pt-8 ">
              <div className="">
                <h1 className="text-2xl font-semibold text-primary">
                  Data Tabel Informasi Suara
                </h1>
                <h1 className="text-2xl xl:text-4xl font-semibold">
                  Kota Banda Aceh
                </h1>
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

              <div className="hidden xl:flex flex-col">
                {loading ? (
                  <div className="flex flex-row m-2 border-[2px] border-gray-300 rounded-xl cursor-pointer p-4 px-10">
                    <CircularProgress sx={{ color: "#d1d5db" }} size={25} />
                    <h1 className="text-gray-300 text-xl font-semibold pl-2">
                      Loading
                    </h1>
                  </div>
                ) : (
                  <div
                    className="flex flex-row m-2 border-[2px] border-orange-400 rounded-xl cursor-pointer p-4 px-10"
                    onClick={handleImageClick}
                  >
                    <FiUpload size={24} className="text-orange-400" />
                    <h1 className="text-orange-400 text-xl pl-2">
                      Import CSV
                    </h1>
                  </div>
                )}
              </div>
            </div>

            <div className="flex pt-4">
              <Breadcrumbs
                kecamatan={kecamatan}
                kelurahan={kelurahan}
                tps={tps}
                table
                admin
              />
            </div>

            <div className="md:hidden flex flex-col w-full px-6">
              {loading ? (
                <div className="flex flex-row w-full border-[2px] border-gray-300 justify-center rounded-xl cursor-pointer p-4 px-10">
                  <CircularProgress sx={{ color: "#d1d5db" }} size={25} />
                  <h1 className="text-gray-300 text-xl font-semibold pl-2">
                    Loading
                  </h1>
                </div>
              ) : (
                <div
                  className="flex flex-row w-full border-[2px] border-orange-400 justify-center rounded-xl cursor-pointer p-4 px-10"
                  onClick={handleImageClick}
                >
                  <FiUpload size={24} className="text-orange-400" />
                  <h1 className="text-orange-400 text-xl pl-2">
                    Import CSV
                  </h1>
                </div>
              )}
            </div>

            <div className="flex flex-col w-full px-6 pt-2">
              <StickyHeadTable
                data={listKecamatan ? listKecamatan : []}
                kecamatan
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
            totalSuara={allVotes ? allVotes.total_suara : 0}
            persentase={allVotes ? allVotes.persentase : 0}
          />
          <Footer />
        </div>
      </div>
    </div>
  );
}
