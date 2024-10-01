import Sidebar from "../../components/Sidebar";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { parseToken } from "../../utils/parseToken";
import Cookies from "js-cookie";
import Footer from "../../components/Footer";
import HeaderAdmin from "../../components/HeaderAdmin";
import { AlertError } from "../../utils/customAlert";
import { clearAllCookies } from "../../utils/cookies";

export default function Profile() {
  const { kecamatan, kelurahan, tps } = useParams();
  const [expanded, setExpanded] = useState(true);
  const navigate = useNavigate();
  const [allVotes, setAllVotes] = useState("");
  const [userDetail, setUserDetail] = useState("");

  const apiUrl = import.meta.env.VITE_API_URL;

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
      .catch((error) => {
        if (error.message === "Sesi Anda Berakhir") {
          clearAllCookies();
          navigate("/login");
        }
      });
  }, [navigate, kecamatan, kelurahan, tps, apiUrl]);

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
            title="Profile"
            user={userDetail}
            allVotes={allVotes}
          />

          <div className="flex pr-4"></div>

          <div className="px-6 pr-8 pt-8">
            <div className="flex flex-row w-full justify-between items-center">
              <div className="flex flex-row items-center bg-white py-8 px-12 rounded-3xl shadow-xl">
                <div className="border-[4px] border-primary rounded-full">
                  <img
                    src="/images/profile.jpg"
                    alt=""
                    className="w-36 rounded-full p-2"
                  />
                </div>
                <div className="flex flex-col pl-4">
                  <h1 className="text-2xl xl:text-4xl font-semibold text-primary">
                    Admin Kamar Hitung
                  </h1>
                  <h1 className="text-xl xl:text-3xl font-semibold">Admin</h1>
                </div>
              </div>
            </div>

            <div className="pt-8 xl:pr-24">
              <h1 className="text-2xl text-gray-400">Profile Information</h1>
              <h1 className="xl:text-xl pt-4">
                Memiliki tanggung jawab dalam memproses Website Real Quick Count dilengkapi dengan berbagai fitur untuk
                mendukung proses pemungutan suara yang efektif dan transparan.
                Fitur utamanya mencakup kemampuan untuk menghitung suara
                berdasarkan kecamatan, kelurahan, dan TPS, serta opsi untuk
                mencetak hasil suara dalam format PDF, mengimpor
                data dari file CSV dan mengekspor hasil suara ke dalam bentuk tabel, sehingga memudahkan analisis. Selain itu, admin dapat
                mengedit data suara dan memperbarui profil saksi, serta
                mengelola komunikasi melalui SMS, termasuk pesan masuk dan
                keluar.
              </h1>

              <div className="pt-10">
                <h1 className="xl:text-xl">Email : -</h1>
                <h1 className="xl:text-xl">Username : admin</h1>
                <h1 className="xl:text-xl">Location : Banda Aceh, Indonesia</h1>
              </div>
            </div>
          </div>

          <Footer />
        </div>
      </div>
    </div>
  );
}
