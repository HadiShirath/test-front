import { useState, useEffect, useRef } from "react";
import Swal from "sweetalert2";
import { TiTick } from "react-icons/ti";
import { MdEdit } from "react-icons/md";
import { FiUpload } from "react-icons/fi";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import RunningText from "../../components/RunningText";
import ModalPhoto from "../../components/atoms/ModalPhoto";
import { clearAllCookies } from "../../utils/cookies";
import { parseToken } from "../../utils/parseToken";
import Footer from "../../components/Footer";
import CircularProgress from "@mui/material/CircularProgress";
import { AlertError } from "../../utils/customAlert";
import HeaderSaksi from "../../components/HeaderSaksi";

export default function Saksi() {
  const inputRef = useRef();
  const inputReff = useRef();
  const [image, setImage] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  const [dataTPS, setDataTPS] = useState("");
  const [loadingImage, setLoadingImage] = useState(false);
  const [allVotes, setAllVotes] = useState("");
  const [loading, setLoading] = useState(false);

  const apiUrl = import.meta.env.VITE_API_URL;
  const apiUrlBase = import.meta.env.VITE_API_URL_BASE;

  const token = Cookies.get("access_token");

  useEffect(() => {
    const token = Cookies.get("access_token");

    if (token) {
      const data = parseToken(token);

      if (data.role !== "saksi") {
        clearAllCookies();
        navigate("/login");
      }
    } else {
      AlertError({ title: "Waktu Habis", text: "Sesi Anda Berakhir" });

      setTimeout(() => {
        clearAllCookies();
        navigate("/login");
      }, 2000);
    }
  }, [navigate]); // Hanya bergantung pada navigate

  useEffect(() => {
    const token = Cookies.get("access_token");

    setLoadingImage(true);

    fetch(`${apiUrl}/tps`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        const dataTPS = data.payload;
        setDataTPS(dataTPS);
        if (dataTPS.photo !== "") {
          setImage(dataTPS.photo);
        }

        setLoadingImage(false);
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
      });
  }, [apiUrl, navigate]);

  const handleImageClick = () => {
    inputRef.current.click();
  };

  const handleDetailPhoto = () => {
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault(); // Mencegah pengiriman formulir default

    setLoading(true);

    const formData = new FormData();
    var file = event.target.files[0];

    // Cek ekstensi file
    if (
      file.type != "image/jpeg" &&
      file.type != "image/png" &&
      file.type != "image/png"
    ) {
      setLoading(false);
      return Swal.fire({
        title: "Upload File Gagal",
        text: "Harap memilih file JPG/PNG",
        icon: "error",
        showConfirmButton: false,
        timer: 2000,
      });
    }

    // Ukuran file max 5 MB
    const MAX_DATA_SIZE = 5 * 1024 * 1024; // 10 MB
    if (file.size > MAX_DATA_SIZE) {
      setLoading(false);
      return Swal.fire({
        title: "File Terlalu Besar",
        text: "File maksimal 5 MB",
        icon: "error",
        showConfirmButton: false,
        timer: 2000,
      });
    }

    if (file) {
      formData.append("photo", file);

      // Mengirim file ke server
      fetch(`${apiUrl}/tps/photo`, {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${token}`, // Ganti dengan token JWT Anda
        },
      })
        .then((response) => {
          if (response.status === 401) {
            throw new Error("Unauthorized");
          } else if (response.status === 404) {
            // Tangani status 404
            Swal.fire({
              title: "Upload Foto Gagal",
              text: "File photo tidak ditemukan",
              icon: "error",
              showConfirmButton: false,
              timer: 2000,
            });
          } else if (response.status === 400) {
            // Tangani status 400
            Swal.fire({
              title: "Upload Foto Gagal",
              text: "Harap pilih foto Jpg/Png",
              icon: "error",
              showConfirmButton: false,
              timer: 2000,
            });
          }
          
          // Cek status lainnya
          if (!response.ok) {
            throw new Error("Upload Foto Error");
          }

          return response.json();
        })
        .then((data) => {
          if (data.success) {
            // File is selected, update the image state
            Swal.fire({
              title: "Berhasil",
              text: "Foto berhasil diunggah",
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
              title: "Upload Foto Gagal",
              text: data.message,
              icon: "error",
              showConfirmButton: false,
              timer: 2000,
            });
          }
        })
        .catch((error) => {
          
          setLoading(false);

          if (error.message === "Failed to fetch") {
            Swal.fire({
              title: "Upload Foto Gagal",
              text: "Jenis File Harus JPG/PNG dan ukuran maksimal 5 MB",
              icon: "error",
              showConfirmButton: false,
              timer: 2000,
            });
          }
        });
    }
  };

  const handleValidationChangePhoto = () => {
    Swal.fire({
      title: "Ganti Foto Form C1",
      text: "Apakah Kamu Yakin?",
      showCancelButton: true,
      confirmButtonText: "Yakin",
      confirmButtonColor: "#008FFB",
      focusConfirm: false,
      cancelButtonText: "Batal",
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        // Pilih
        inputReff.current.click();
      }
    });
  };

  return (
    <>
      {isModalOpen && (
        <ModalPhoto
          photo={dataTPS ? dataTPS.photo : ""}
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
        />
      )}
      <div className="flex flex-col w-full h-full justify-between">
        <div>
          <HeaderSaksi user={dataTPS} />

          <div className="flex flex-col w-full bg-gray-100 px-12">
            <h1 className="text-2xl xl:text-3xl font-semibold text-center pt-8">
              Kecamatan{" "}
              <span className="font-bold">
                {dataTPS ? dataTPS.kecamatan_name : ""}
              </span>{" "}
              Kelurahan{" "}
              <span className="font-bold">
                {dataTPS ? dataTPS.kelurahan_name : ""}
              </span>
            </h1>
            <h1 className="text-2xl xl:text-3xl font-semibold text-center pb-8">
              <span className="font-bold">
                {dataTPS ? dataTPS.tps_name : ""}
              </span>
            </h1>
          </div>
        </div>

        <div className="flex flex-col w-full items-center py-8 px-8">
          <div className="py-5">
            {loadingImage ? (
              <div className="flex flex-col items-center">
                {" "}
                <CircularProgress size={30} /> <h1 className="pt-4">Loading</h1>
              </div>
            ) : (dataTPS && dataTPS.photo !== "") || image ? (
              <div>
                <div
                  className="w-[300px] h-[400px] xl:w-[400px] xl:h-[600px] rounded-2xl border-gray-200 border-[4px] relative"
                  onClick={handleDetailPhoto}
                >
                  <div className="bg-green-500 w-[55px] h-[55px] flex items-center justify-center border-[3px] border-white  rounded-full absolute -right-4 -bottom-2">
                    <TiTick className="text-white text" size={40} />
                  </div>
                  <img
                    id="image"
                    src={
                      image
                        ? `${apiUrlBase}/images/${image}`
                        : `${apiUrlBase}/images/${dataTPS.photo}`
                    }
                    alt="form-c1"
                    className="w-full h-full object-cover rounded-2xl"
                  />
                </div>

                <form id="uploadForm" encType="multipart/form-data">
                  <input
                    type="file"
                    accept="image/*"
                    ref={inputReff}
                    onChange={handleFormSubmit}
                    style={{ display: "none" }}
                  />

                  {loading ? (
                    <div
                      className="flex flex-row bg-gray-300 w-full px-12 xl:px-24 mt-6 py-4 items-center justify-center rounded-xl"
                    >
                     <CircularProgress sx={{ color: "#ffffff" }} size={25} />
                      <h1 className="text-white text-xl font-semibold pl-2">
                        Loading
                      </h1>
                    </div>
                  ) : (
                    <div
                      onClick={handleValidationChangePhoto}
                      className="flex flex-row bg-primary w-full px-12 xl:px-24 mt-6 py-4 items-center justify-center rounded-xl cursor-pointer"
                    >
                      <MdEdit size={24} className="text-white mr-2" />
                      <h1 className="text-white text-xl font-semibold text-center">
                        Ganti Foto
                      </h1>
                    </div>
                  )}
                </form>
              </div>
            ) : (
              <div className="flex flex-col w-full items-center">
                {/* <TbPhotoFilled size={80} className="text-gray-300" /> */}
                <img
                  src="/images/Not-found.jpg"
                  alt=""
                  className="w-full h-auto sm:w-[450px] sm:h-[450px]"
                />
                <h1 className="text-2xl xl:text-3xl font-semibold text-orange-500 pt-8">
                  TPS ini Belum Ada Foto
                </h1>
                <h1 className="text-xl xl:text-2xl text-gray-500 text-center">
                  Silahkan unggah foto Form C1 anda
                </h1>
                <h1 className="text-md xl:text-xl text-gray-500 pb-6">
                  Format JPG / PNG
                </h1>

                <form id="uploadForm" encType="multipart/form-data">
                  <input
                    type="file"
                    ref={inputRef}
                    onChange={handleFormSubmit}
                    style={{ display: "none" }}
                  />

                  {loading ? (
                    <div className="flex flex-row bg-gray-300 px-12 xl:px-24 py-4 items-center justify-center rounded-xl">
                      <CircularProgress sx={{ color: "#ffffff" }} size={25} />
                      <h1 className="text-white text-xl font-semibold pl-2">
                        Loading
                      </h1>
                    </div>
                  ) : (
                    <div
                      onClick={handleImageClick}
                      className="flex flex-row bg-primary px-12 xl:px-24 py-4 items-center justify-center rounded-xl cursor-pointer"
                    >
                      <FiUpload size={24} className="text-white mr-3" />
                      <h1 className="text-white text-xl font-semibold text-center">
                        Unggah Foto
                      </h1>
                    </div>
                  )}
                </form>
              </div>
            )}
          </div>
        </div>

        <div>
          <RunningText
            totalSuara={allVotes.total_suara}
            persentase={allVotes.persentase}
          />
          <Footer />
        </div>
      </div>
    </>
  );
}
