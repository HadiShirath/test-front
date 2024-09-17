import Footer from "../../components/Footer";
import RunningText from "../../components/RunningText";
import { MdLocalPrintshop } from "react-icons/md";
import { useRef, useEffect, useState } from "react";
import { useReactToPrint } from "react-to-print";
import { useParams, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { parseToken } from "../../utils/parseToken";
import Swal from "sweetalert2";
import ModalPhoto from "../../components/atoms/ModalPhoto";
import Header from "../../components/Header";
import Breadcrumbs from "../../components/Breadcrumbs";
import { AlertError } from '../../utils/customAlert';
import { clearAllCookies } from '../../utils/cookies';

export default function Home() {
  const { kecamatan, kelurahan, tps } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState("");
  const [userDetail, setUserDetail] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [allVotes, setAllVotes] = useState("");

  const apiUrl = import.meta.env.VITE_API_URL;
  const apiUrlBase = import.meta.env.VITE_API_URL_BASE;


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

    fetch(`${apiUrl}/tps/voter/${tps}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setData(data.payload);
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
  }, [navigate, kecamatan, kelurahan, tps]);

  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  const handleDetailPhoto = () => {
    setIsModalOpen(true);
  };

  return (
    <>
      {isModalOpen && (
        <ModalPhoto
          photo={data.photo}
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
        />
      )}
      <div className="flex flex-col items-center w-full">
        <div ref={componentRef} className="flex flex-col w-full">
          <Header user={userDetail} />

          <div className="flex flex-col pb-5">
            <div className="flex flex-col w-full items-center text-center bg-slate-100 py-8 mb-8 px-4">
              <h1 className="text-2xl xl:text-4xl font-semibold">
                Foto Form C1
              </h1>
              <h1 className="text-xl xl:text-3xl">
                Kecamatan <span>{data.kecamatan_name},</span> Kelurahan{" "}
                <span>{data.kelurahan_name},</span> {data.tps_name}{" "}
              </h1>
            </div>
            <div className="flex flex-col w-full justify-center items-center ">
              <Breadcrumbs
                valueKecamatan={data.kecamatan_name}
                valueKelurahan={data.kelurahan_name}
                valueTps={data.tps_name}
                photo
              />

              {data.photo && data.photo !== "" ? (
                <div
                  className="w-[300px] h-[500px] xl:w-[400px] xl:h-[600px] rounded-2xl border-gray-200 border-[4px] relative"
                  onClick={handleDetailPhoto}
                >
                  <img
                    id="image"
                    src={`${apiUrlBase}/images/${data.photo}`}
                    alt="form-c1"
                    className="w-full h-full object-cover rounded-xl"
                  />
                </div>
              ) : (
                <div className="">
                  <img
                    src="/images/Not-found.jpg"
                    alt=""
                    className="w-full h-auto sm:w-[450px] sm:h-[450px]"
                  />
                  <h1 className="text-2xl text-center xl:text-4xl font-semibold text-orange-500 pt-8">
                    TPS ini Belum Ada Foto
                  </h1>
                  <h1 className="text-xl xl:text-3xl text-gray-500 text-center">
                    Coba beberapa saat lagi
                  </h1>
                </div>
              )}
            </div>
          </div>

          {/* <div className="hidden md:flex flex-row w-full items-center justify-center pt-8 gap-2 px-4">
            <div
              className="bg-primary py-4 px-8 rounded-xl"
              onClick={handleToPageTable}
            >
              <h1 className="text-white text-lg">Tampilkan Tabel Suara</h1>
            </div>
            <div
              className="hidden md:flex flex-row bg-primary py-4 px-8 gap-2 items-center rounded-xl cursor-pointer"
              onClick={handlePrint}
            >
              <MdLocalPrintshop size={24} className="text-white" />
              <h1 className="text-white text-lg">Cetak</h1>
            </div>
          </div> */}
        </div>
        {/* <div className="md:hidden flex flex-col w-full">
          <div className="flex-row mt-4  px-16 items-center">
            <a href="/table">
              <div className="bg-primary py-3 flex flex-row justify-center rounded-xl gap-2">
                <h1 className="text-white text-lg">Tampilkan Tabel Suara </h1>
              </div>
            </a>
          </div>

          <div className="flex flex-row mt-2  px-16 items-center">
            <div
              className="border-[2px] border-primary py-3 flex flex-row w-full justify-center rounded-xl gap-2 cursor-pointer"
              onClick={handlePrint}
            >
              <MdLocalPrintshop size={24} className="text-primary" />
              <h1 className="text-primary text-lg">Cetak</h1>
            </div>
          </div>
        </div> */}

        <RunningText
          totalSuara={allVotes.total_suara}
          persentase={allVotes.persentase}
        />
        <Footer />
      </div>
    </>
  );
}
