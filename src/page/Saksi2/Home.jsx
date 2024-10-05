import { useState, useEffect, useRef } from "react";
import Swal from "sweetalert2";
import { TiTick } from "react-icons/ti";
import { MdEdit } from "react-icons/md";
import { FiUpload, FiSave } from "react-icons/fi";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import RunningText from "../../components/RunningText";
import ModalPhoto from "../../components/atoms/ModalPhoto";
import { clearAllCookies } from "../../utils/cookies";
import { parseToken } from "../../utils/parseToken";
import Footer from "../../components/Footer";
import CircularProgress from "@mui/material/CircularProgress";
import { AlertError } from "../../utils/customAlert";
import { AlertWarning } from "../../utils/customAlert";
import HeaderSaksi from "../../components/HeaderSaksi";

export default function Saksi2() {
  const inputRef = useRef();
  const inputReff = useRef();
  const [image, setImage] = useState("");
  const [imageLocal, setImageLocal] = useState("");
  const [previewImageLocal, setPreviewImageLocal] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  const [dataTPS, setDataTPS] = useState("");
  const [loadingImage, setLoadingImage] = useState(true);
  const [allVotes, setAllVotes] = useState("");
  const [paslon1, setPaslon1] = useState(0);
  const [paslon2, setPaslon2] = useState(0);
  const [paslon3, setPaslon3] = useState(0);
  const [paslon4, setPaslon4] = useState(0);
  const [suaraSah, setSuaraSah] = useState(0);
  const [suaraTidakSah, setSuaraTidakSah] = useState(0);
  const [loading, setLoading] = useState(false);
  const [previousData, setPreviousData] = useState({});

  const apiUrl = import.meta.env.VITE_API_URL;
  const apiUrlBase = import.meta.env.VITE_API_URL_BASE;

  const token = Cookies.get("access_token");

  useEffect(() => {
    const token = Cookies.get("access_token");

    if (token) {
      const data = parseToken(token);

      if (data.role !== "saksi_v2") {
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
  }, [navigate, paslon1, paslon2, paslon3, paslon4]); // Hanya bergantung pada navigate

  useEffect(() => {
    const token = Cookies.get("access_token");

    setLoadingImage(true);

    fetch(`${apiUrl}/tps`, {
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
        const dataTPS = data.payload;
        setDataTPS(dataTPS);

        setPaslon1(dataTPS.paslon1);
        setPaslon2(dataTPS.paslon2);
        setPaslon3(dataTPS.paslon3);
        setPaslon4(dataTPS.paslon4);
        setSuaraSah(dataTPS.suara_sah);
        setSuaraTidakSah(dataTPS.suara_tidak_sah);

        if (dataTPS.photo !== "") {
          setImage(dataTPS.photo);
        }

        setPreviousData({
          paslon1: dataTPS.paslon1,
          paslon2: dataTPS.paslon2,
          paslon3: dataTPS.paslon3,
          paslon4: dataTPS.paslon4,
          suaraTidakSah: dataTPS.suara_tidak_sah,
          photo: dataTPS.photo,
        });

        setLoadingImage(false);
      })
      .catch((error) => {
        Swal.fire({
          title: "Terjadi Kesalahan",
          text: error,
          icon: "error",
          showConfirmButton: false,
          timer: 2000,
        });

        setLoadingImage(false);
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
      .catch((error) =>
        AlertError({
          title:
            error.message === "Sesi Anda Berakhir"
              ? "Waktu Habis"
              : "Terjadi Kesalahan",
          text: error.message,
        })
      );
  }, [apiUrl]);

  const handleImageClick = () => {
    inputRef.current.click();
  };

  const handleDetailPhoto = () => {
    setIsModalOpen(true);
  };

  const handleChangePhoto = (event) => {
    event.preventDefault(); // Mencegah pengiriman formulir default

    var file = event.target.files[0];

    // Cek ekstensi file
    if (
      file.type != "image/jpeg" &&
      file.type != "image/png" &&
      file.type != "image/png"
    ) {
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
      return Swal.fire({
        title: "File Terlalu Besar",
        text: "File maksimal 5 MB",
        icon: "error",
        showConfirmButton: false,
        timer: 2000,
      });
    }

    if (file) {
      // simpan file data gambar
      setImageLocal(file);

      // simpan preview gambar
      setPreviewImageLocal(URL.createObjectURL(file));
    }
  };

  const validateVoteTPS = () => {
    return suaraSah <= 600 + 600 * 0.02;
  };

  const endpointUpload = (formData, setLoading) => {
    // Mengirim file ke server
    fetch(`${apiUrl}/tps/upload`, {
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
          // Tangani status 401 Unauthorized
          Swal.fire({
            title: "Upload Data Gagal",
            text: "Harap periksa kembali data",
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
            text: "Data anda berhasil dikirim",
            icon: "success",
            showConfirmButton: false,
            timer: 2000,
          });

          setTimeout(() => {
            window.location.reload();
          }, 2000);
        } else {
          Swal.fire({
            title: "Upload Foto Gagal",
            text: data.message,
            icon: "error",
            showConfirmButton: false,
            timer: 2000,
          });
        }

        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);

        if (error.message === "Failed to fetch") {
          Swal.fire({
            title: "Upload Data gagal",
            text: "Jenis File Harus JPG/PNG dan ukuran maksimal 5 MB",
            icon: "error",
            showConfirmButton: false,
            timer: 2000,
          });
        }
      });
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault(); // Mencegah pengiriman formulir default

    setLoading(true);

    const formData = new FormData();

    const validateVoteTPSValue = validateVoteTPS();

    formData.append("paslon1", paslon1);
    formData.append("paslon2", paslon2);
    formData.append("paslon3", paslon3);
    formData.append("paslon4", paslon4);
    formData.append("suara_sah", suaraSah);
    formData.append("suara_tidak_sah", suaraTidakSah);

    if (
      paslon1 === previousData.paslon1 &&
      paslon2 === previousData.paslon2 &&
      paslon3 === previousData.paslon3 &&
      paslon4 === previousData.paslon4 &&
      suaraTidakSah === previousData.suaraTidakSah
    ) {
      if (
        (imageLocal || dataTPS.photo !== previousData.photo) &&
        validateVoteTPSValue
      ) {
        if (imageLocal) {
          formData.append("photo", imageLocal);
        }
        // upload data
        endpointUpload(formData, setLoading);
      } else {
        AlertWarning({
          title: "Tidak Ada Perubahan Data",
          text: "Harap mengubah data jika ingin melakukan perubahan",
        });

        setLoading(false);
      }
    } else if (!validateVoteTPSValue) {
      setLoading(false);
      AlertWarning({
        title: "Suara Melebihi Ketentuan TPS",
        text: "Harap periksa kembali data suara paslon",
      });
    } else if (
      paslon1 !== previousData.paslon1 ||
      paslon2 !== previousData.paslon2 ||
      paslon3 !== previousData.paslon3 ||
      paslon4 !== previousData.paslon4 ||
      suaraTidakSah === previousData.suaraTidakSah
    ) {
      if (imageLocal) {
        formData.append("photo", imageLocal);
      }
      // upload data
      endpointUpload(formData, setLoading);
    } else {
      setLoading(false);
      AlertWarning({
        title: "Data Belum Lengkap",
        text: "Harap Mengisi data secara lengkap beserta Form C1",
      });
    }
  };

  const handleValidationChangePhoto = () => {
    Swal.fire({
      title: "Ganti Foto Form C1",
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
        // Pilih
        inputReff.current.click();
      }
    });
  };

  const handleValue = (event, setPaslon, setSuaraSah, index) => {
    var newValue = parseInt(event.target.value, 10);
    if (isNaN(newValue)) {
      newValue = 0;
    }
    setPaslon(newValue);

    // suara paslon
    const updatedPaslons = [paslon1, paslon2, paslon3, paslon4];
    updatedPaslons[index] = newValue;

    // Update suaraSah
    setSuaraSah(updatedPaslons.reduce((total, value) => total + value, 0));
  };

  const handleChangePaslon1 = (event) => {
    handleValue(event, setPaslon1, setSuaraSah, 0);
  };
  const handleChangePaslon2 = (event) => {
    handleValue(event, setPaslon2, setSuaraSah, 1);
  };
  const handleChangePaslon3 = (event) => {
    handleValue(event, setPaslon3, setSuaraSah, 2);
  };
  const handleChangePaslon4 = (event) => {
    handleValue(event, setPaslon4, setSuaraSah, 3);
  };

  const handleChangeSuaraTidakSah = (event) => {
    var newValue = parseInt(event.target.value, 10);
    if (isNaN(newValue)) {
      newValue = 0;
    }

    setSuaraTidakSah(newValue);
  };

  const previewPhoto = previewImageLocal
    ? previewImageLocal
    : image !== ""
    ? `${apiUrlBase}/images/${image}`
    : dataTPS && dataTPS.photo !== ""
    ? `${apiUrlBase}/images/${dataTPS.photo}`
    : null;

  const inputData = [
    { label: "Suara Paslon 1", value: paslon1, onChange: handleChangePaslon1 },
    { label: "Suara Paslon 2", value: paslon2, onChange: handleChangePaslon2 },
    { label: "Suara Paslon 3", value: paslon3, onChange: handleChangePaslon3 },
    { label: "Suara Paslon 4", value: paslon4, onChange: handleChangePaslon4 },
    { label: "Suara Sah", value: suaraSah, readOnly: true, disabled: true },
    {
      label: "Suara Tidak Sah",
      value: suaraTidakSah,
      onChange: handleChangeSuaraTidakSah,
    },
  ];

  return (
    <>
      {isModalOpen && (
        <ModalPhoto
          photo={
            previewImageLocal ? previewImageLocal : dataTPS ? dataTPS.photo : ""
          }
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
          previewImageLocal={previewImageLocal ? true : false}
        />
      )}
      <div className="flex flex-col w-full h-full justify-between">
        <form id="dataTPSForm" encType="multipart/form-data">
          <div className="flex flex-col">
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

          <div className="flex flex-col w-full items-center px-8 xl:px-60 ">
            <div className="flex flex-col md:flex-row md:justify-between w-full pt-12 md:pt-20 pb-10">
              <div className="flex flex-col w-full">
                <h1 className="text-2xl xl:text-3xl font-semibold">
                  Input Data TPS
                </h1>
                <h1 className="text-xl xl:text-2xl pb-8 xl:pb-16">
                  Masukkan nilai suara TPS anda
                </h1>

                <div className="flex flex-col h-full md:justify-between">
                  {inputData.map((input, index) => (
                    <div
                      className="flex flex-row items-center pb-6"
                      key={index}
                    >
                      <h1 className="text-xl xl:text-2xl w-full">
                        {input.label} :
                      </h1>
                      <input
                        className="h-12 rounded-xl px-4 bg-gray-50 w-full"
                        value={input.value}
                        onChange={input.onChange}
                        readOnly={input.readOnly}
                        disabled={input.disabled}
                      />
                    </div>
                  ))}

                  <h1 className="pt-8 italic text-gray-500">
                    * Suara Sah terisi secara otomatis dari jumlah suara paslon
                  </h1>
                </div>
              </div>

              <div className="hidden md:flex flex-col border-r-4 w-1/5" />

              <div className="flex flex-col w-full items-center pt-10 md:items-end md:pt-0">
                <div>
                  {loadingImage ? (
                    <div className="flex flex-col h-full justify-center items-center">
                      <CircularProgress size={30} />
                      <h1 className="pt-4">Loading</h1>
                    </div>
                  ) : previewPhoto ? (
                    <div>
                      <div
                        className="w-[300px] h-[400px] xl:w-[400px] xl:h-[580px] rounded-2xl border-gray-200 border-[4px] relative"
                        onClick={handleDetailPhoto}
                      >
                        <div className="bg-green-500 w-[55px] h-[55px] flex items-center justify-center border-[3px] border-white rounded-full absolute -right-4 -bottom-2">
                          <TiTick className="text-white" size={40} />
                        </div>
                        <img
                          id="image"
                          src={previewPhoto}
                          alt="form-c1"
                          className="w-full h-full object-cover rounded-2xl"
                        />
                      </div>

                      <input
                        type="file"
                        accept="image/*"
                        ref={inputReff}
                        onChange={handleChangePhoto}
                        style={{ display: "none" }}
                      />
                      <div
                        onClick={handleValidationChangePhoto}
                        className="flex flex-row border-[2px] border-primary w-full px-12 xl:px-24 mt-6 py-4 items-center justify-center rounded-xl cursor-pointer"
                      >
                        <MdEdit size={24} className="text-primary mr-2" />
                        <h1 className="text-primary text-xl font-semibold text-center">
                          Ganti Foto
                        </h1>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col w-full items-center">
                      <img
                        src="/images/Not-found.jpg"
                        alt=""
                        className="w-full h-auto sm:w-[450px] sm:h-[460px]"
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

                      <input
                        type="file"
                        accept="image/*"
                        ref={inputRef}
                        onChange={handleChangePhoto}
                        style={{ display: "none" }}
                      />
                     
                     <div
                        onClick={handleImageClick}
                        className="flex flex-row border-[2px] border-primary px-12 xl:px-24 py-4 items-center justify-center rounded-xl cursor-pointer"
                      >
                        <FiUpload size={24} className="text-primary mr-3" />
                        <h1 className="text-primary text-xl font-semibold text-center">
                          Unggah Foto
                        </h1>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-row w-full justify-center px-8 py-2 md:py-4">
            {loading ? (
              <div className="flex flex-row bg-gray-300 py-4 w-full md:w-auto md:px-24 justify-center rounded-xl">
                <CircularProgress sx={{ color: "#ffffff" }} size={25} />
                <h1 className="text-white font-bold text-lg pl-2">Loading</h1>
              </div>
            ) : (
              <div
                className="flex flex-row bg-primary py-4 w-full md:w-auto md:px-24 justify-center rounded-xl cursor-pointer"
                onClick={handleFormSubmit}
              >
                <FiSave size={25} className="text-white" />
                <h1 className="pl-4 text-white text-xl font-medium">Simpan</h1>
              </div>
            )}
          </div>

          <div>
            <RunningText
              totalSuara={allVotes.total_suara}
              persentase={allVotes.persentase}
            />
            <Footer />
          </div>
        </form>
      </div>
    </>
  );
}
