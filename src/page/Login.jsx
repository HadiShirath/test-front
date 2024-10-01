import Swal from "sweetalert2";
import Footer from "../components/Footer";
import { useState, useEffect } from "react";
import axios from "axios";
import { HiEye } from "react-icons/hi2";
import { useNavigate } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import Cookies from "js-cookie";
import { parseToken } from "../utils/parseToken";

export default function Login() {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [isHidePassword, setIsHidePassword] = useState(true);
  const [loading, setLoading] = useState("");
  const navigate = useNavigate();

  const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    // Membaca cookie saat aplikasi dimuat
    if (Cookies.get("access_token")) {
      const token = Cookies.get("access_token");
      const data = parseToken(token);
      if (data.role === "saksi_v2") {
        navigate(`/saksi/v2`);
      } else if (data.role === "saksi") {
        navigate(`/saksi`);
      } else if (data.role === "user") {
        navigate(`/user`);
      } else if (data.role === "admin") {
        navigate(`/admin/dashboard`);
      }
    }
  }, [navigate]);

  const handleChangeUserName = (event) => {
    setUserName(event.target.value);
  };
  const handleChangePassword = (event) => {
    setPassword(event.target.value);
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (userName && password) {
      setLoading(true);

      setTimeout(async () => {
        try {
          await axios
            .post(
              `${apiUrl}/auth/login`,
              {
                username: userName,
                password: password,
              },
              {
                withCredentials: true, // Allows cookies to be sent and receive
              }
            )
            .then((response) => {
              if (response.status === 200) {
                const token = Cookies.get("access_token");

                const data = parseToken(token);
                if (data.role === "saksi_v2") {
                  navigate("/saksi/v2");
                } else if (data.role === "saksi") {
                  navigate("/saksi");
                } else if (data.role === "user") {
                  navigate("/user");
                } else if (data.role === "admin") {
                  navigate("/admin/dashboard");
                }
              }
            });
        } catch (error) {
          if (error.response) {
            // The request was made and the server responded with a status code
            if (
              error.response.status === 400 ||
              error.response.status === 401 ||
              error.response.status === 404
            ) {
              Swal.fire({
                title: "Perhatian",
                text: "Username / Password tidak valid",
                icon: "error",
                showConfirmButton: false,
                timer: 2000,
              });
            }
          } else if (error.request) {
            // The request was made but no response was received
            Swal.fire({
              title: "Perhatian",
              text: "Tidak ada respons dari server. Silakan coba lagi.",
              icon: "error",
              showConfirmButton: false,
              timer: 2000,
            });
          } else {
            // Something happened in setting up the request that triggered an Error
            Swal.fire({
              title: "Perhatian",
              text: "Terjadi kesalahan. Silakan coba lagi.",
              icon: "error",
              showConfirmButton: false,
              timer: 2000,
            });
          }
        }

        setLoading(false);
      }, 1000);
    } else {
      Swal.fire({
        title: "Perhatian",
        text: "Harap Masukkan Username & Passowrd",
        icon: "warning",
        showConfirmButton: false,
        timer: 2000,
      });
    }
  };

  return (
    <div className="flex flex-col w-full h-full justify-between ">
      <div className="flex flex-col lg:flex-row w-full h-full">
        <div className="flex flex-col w-full px-6 lg:px-14 pt-12 justify-between">
          <div className="flex flex-row w-full justify-center pb-4">
            <img
              src="/images/kamar-hitung.png"
              alt="kamar-hitung"
              className="h-10 pr-4"
            />
            <h1 className="text-2xl md:text-4xl">Kamarhitung</h1>
          </div>

          <div className="flex flex-col items-center text-2xl md:text-5xl font-semibold">
            <h1>Real Quick Count Pemilihan</h1>
            <h1>Walikota & Wakil Walikota</h1>
            <h1>Kota Banda Aceh</h1>
            {/* <h1>Lorem ipsum dolor sit amet</h1>
            <h1>consectetur adipiscing elit</h1>
            <h2>sed do eiusmod tempor</h2> */}
          </div>

          <div className="xl:flex hidden pt-20">
            <img src="/images/kotaksuara.jpg" alt="" />
          </div>
        </div>
        <div className="flex flex-col w-full h-full justify-center ">
          <div className="flex flex-col bg-white  shadow-lg px-8 xl:px-16 mx-8 py-12 lg:py-24 lg:mx-32 rounded-3xl">
            <h1 className="text-center font-semibold text-3xl md:text-4xl">
              Login
            </h1>
            <h1 className="text-center text-gray-500 text-md md:text-lg pt-2 pb-10">
              Masukkan Username dan password
            </h1>
            <form onSubmit={handleLogin}>
              <h2 className="text-md md:text-xl text-gray-500 pb-4">
                Username
              </h2>
              <input
                className="h-12 w-full rounded-xl px-4 bg-gray-50"
                value={userName}
                onChange={handleChangeUserName}
              />
              <h2 className="text-md md:text-xl text-gray-500 py-4">
                Password
              </h2>
              <div className="flex flex-col w-full relative">
                <input
                  className="h-12 rounded-xl px-4 bg-gray-50 mb-8"
                  type={isHidePassword ? "password" : "text"}
                  value={password}
                  onChange={handleChangePassword}
                />
                <div
                  className="absolute h-12 right-3 z-10 px-2 cursor-pointer"
                  onClick={() => setIsHidePassword(!isHidePassword)}
                >
                  <HiEye className="h-12 text-gray-400 " size={20} />
                </div>
              </div>

              {loading ? (
                <div className="w-full flex flex-row justify-center  bg-gray-300 py-4 items-center rounded-xl">
                  <CircularProgress sx={{ color: "#ffffff" }} size={25} />
                  <h1 className="text-white text-xl font-semibold pl-2">
                    Loading
                  </h1>
                </div>
              ) : (
                <button
                  type="submit"
                  className="w-full flex flex-col  bg-primary py-4 items-center rounded-xl cursor-pointer"
                >
                  <h1 className="text-white text-xl font-semibold">Masuk</h1>
                </button>
              )}
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
