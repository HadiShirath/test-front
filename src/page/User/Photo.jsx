import Footer from "../../components/Footer";
import RunningText from "../../components/RunningText";
import { useRef, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { parseToken } from "../../utils/parseToken";
import ModalPhoto from "../../components/atoms/ModalPhoto";
import Header from "../../components/Header";
import Breadcrumbs from "../../components/Breadcrumbs";
import { AlertError } from "../../utils/customAlert";
import { clearAllCookies } from "../../utils/cookies";

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

  const componentRef = useRef();

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
        </div>

        <RunningText
          totalSuara={allVotes.total_suara}
          persentase={allVotes.persentase}
        />
        <Footer />
      </div>
    </>
  );
}
