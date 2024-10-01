import Sidebar from "../../components/Sidebar";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { parseToken } from "../../utils/parseToken";
import Cookies from "js-cookie";
import Footer from "../../components/Footer";
import RunningText from "../../components/RunningText";
import HeaderAdmin from "../../components/HeaderAdmin";
import Breadcrumbs from "../../components/Breadcrumbs";
import { AlertError } from "../../utils/customAlert";
import { clearAllCookies } from "../../utils/cookies";
import ModalPhoto from "../../components/atoms/ModalPhoto";

export default function Photo() {
  const { kecamatan, kelurahan, tps } = useParams();
  const [expanded, setExpanded] = useState(true);
  const [data, setData] = useState("");
  const navigate = useNavigate();
  const [userDetail, setUserDetail] = useState("");
  const [allVotes, setAllVotes] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

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
      .then((response) => {
        if (response.status === 401) {
          throw new Error("Sesi Anda Berakhir");
        }

        return response.json();
      })
      .then((data) => {
        setAllVotes(data.payload);
      })
  }, [navigate, kecamatan, kelurahan, tps, apiUrl]);

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
      <div className="flex flex-row h-full w-full relative">
        <div className="flex flex-col bg-primary w-full absolute -z-20 h-64 xl:h-52" />

        <Sidebar expanded={expanded} setExpanded={setExpanded} />

        <div
          className={`${
            expanded ? "xl:pl-72" : "xl:pl-28"
          } flex transition-all duration-300 py-4 z-[10] w-full h-screen`}
        >
          <div className="flex flex-col w-full">
            <HeaderAdmin
              expanded={expanded}
              setExpanded={setExpanded}
              title="Foto FORM C1"
              user={userDetail}
              allVotes={allVotes}
            />

            <div className="flex flex-col w-full items-center">
              <div className="px-6 pt-12 text-center">
                <h1 className="text-2xl font-semibold text-primary">
                  Data Foto Form C1
                </h1>
                <h1 className="text-xl xl:text-3xl font-semibold">
                  Kecamatan <span>{data.kecamatan_name},</span> Kelurahan{" "}
                  <span>{data.kelurahan_name},</span> {data.tps_name}{" "}
                </h1>
              </div>

              <div className="flex pt-4">
                <Breadcrumbs
                  valueKecamatan={data.kecamatan_name}
                  valueKelurahan={data.kelurahan_name}
                  valueTps={data.tps_name}
                  photo
                  admin
                />
              </div>

              {data.photo && data.photo !== "" ? (
                <div className="flex flex-col w-full items-center px-6 py-6">
                  <div
                    className="w-full h-[500px] sm:w-[400px] sm:h-[600px] rounded-2xl border-gray-200 border-[4px] relative"
                    onClick={handleDetailPhoto}
                  >
                    <img
                      id="image"
                      src={`${apiUrlBase}/images/${data.photo}`}
                      alt="form-c1"
                      className="w-full h-full object-cover rounded-xl"
                    />
                  </div>
                </div>
              ) : (
                <div className="flex flex-col w-full items-center py-6">
                  <img
                    src="/images/Not-found.jpg"
                    alt=""
                    className="w-full h-auto sm:w-[450px] sm:h-[450px]"
                  />
                  <h1 className="text-2xl text-center xl:text-4xl font-semibold text-orange-500 pt-8">
                    TPS ini Belum Ada Foto C1
                  </h1>
                  <h1 className="text-xl xl:text-3xl text-gray-500 text-center">
                    Data Foto tidak ditemukan
                  </h1>
                </div>
              )}
            </div>

            <RunningText
              totalSuara={allVotes.total_suara}
              persentase={allVotes.persentase}
            />
            <Footer />
          </div>
        </div>
      </div>
    </>
  );
}
