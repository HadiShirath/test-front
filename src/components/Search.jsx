/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { FaSearch } from "react-icons/fa";
import { FormControl, TextField, MenuItem, InputLabel } from "@mui/material";
import { kelurahanOptions, tpsOptions } from "../data/data";
import { useNavigate, useLocation } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import { kecamatanOptions } from "../data/data";
import { FiX } from "react-icons/fi";
import Swal from "sweetalert2";

export default function Search({ kecamatan, kelurahan, tps, admin }) {
  const [searchBox, setSearchBox] = useState(false);
  const [valueKecamatan, setValueKecamatan] = useState("");
  const [valueKelurahan, setValueKelurahan] = useState("");
  const [loading, setLoading] = useState(false);
  const [valueTPS, setValueTPS] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const currentURL = location.pathname;

  useEffect(() => {
    if (tps) {
      setValueTPS(tps);
    }
    if (kelurahan) {
      setValueKelurahan(kelurahan);
    }
    if (kecamatan) {
      setValueKecamatan(kecamatan);
    }
  }, [kecamatan, kelurahan, tps]);

  const dataKelurahan = kelurahanOptions[valueKecamatan];
  const dataTps = tpsOptions[valueKelurahan];

  const styleSelect = {
    "& .MuiInputBase-root": {
      fontFamily: "sans-serif", // Ganti dengan font-family yang diinginkan
    },
    "& .MuiFormLabel-root": {
      fontFamily: "sans-serif", // Ganti dengan font-family yang diinginkan
    },
    "& .MuiOutlinedInput-root": {
      border: "none", // Hapus border pada input
      "& fieldset": {
        border: "none", // Hapus border pada fieldset
      },
    },
    "& .MuiMenuItem-root": {
      fontWeight: "normal", // Mengatur font weight menjadi normal untuk menu item
      fontSize: "1rem", // Pastikan ukuran font sesuai
      height: "20px", // Mengatur tinggi menu item
      display: "flex",
      alignItems: "center", // Mengatur agar teks vertikal tengah
    },
    "& .MuiInputLabel-root": {
      fontSize: "1rem", // Ukuran font label
      fontWeight: "normal", // Berat font label
    },
  };

  const Label = ({ name }) => {
    return (
      <InputLabel
        sx={{
          fontFamily: "sans-serif",
          color: "#000000",
        }}
      >
        {name}
      </InputLabel>
    );
  };

  const handleClick = () => {
    setSearchBox(!searchBox);
  };

  const handleSelect = (event) => {
    setValueKecamatan(event.target.value);
    setValueKelurahan("");
    setValueTPS("");
  };

  const handleSelectKelurahan = (event) => {
    setValueKelurahan(event.target.value);
    setValueTPS("");
  };

  const handleSelectTPS = (event) => {
    setValueTPS(event.target.value);
  };

  const handleSearchData = () => {
    setLoading(true);

    if (!valueKecamatan) {
      Swal.fire({
        title: "Perhatian",
        text: "Harap memilih data untuk melakukan pencarian",
        icon: "warning",
        showConfirmButton: false,
        timer: 2000,
      });
      setLoading(false);
    } else {
      setTimeout(() => {
        // navigasi kehalaman dengan parameter berikut
 
        const base = admin ? "/admin/dashboard" : "/user" 

        if (valueTPS) {
          navigate(`${base}/${valueKecamatan}/${valueKelurahan}/${valueTPS}`)
        } else if (valueKelurahan) {
          navigate(`${base}/${valueKecamatan}/${valueKelurahan}`)
        } else {
          navigate(`${base}/${valueKecamatan}`)
        }

        window.location.reload();
        setLoading(false);
      }, 500);
    }
  };

  const handleRemoveKecamatan = () => {
    setValueTPS("");
    setValueKelurahan("");
    setValueKecamatan("");
  };

  const handleRemoveKelurahan = () => {
    setValueTPS("");
    setValueKelurahan("");
  };

  const handleRemoveTPS = () => {
    setValueTPS("");
  };

  return (
    <div className="flex flex-col w-full pb-6 pt-4 md:px-4 bg-gray-100 mb-8">
      <div className="hidden md:flex flex-wrap items-end justify-between px-8">
        <span className="flex flex-col w-full md:w-[30%] md:pr-4">
          <p className="font-semibold text-lg text-black py-2">Kecamatan</p>
          <div className="flex flex-col w-full bg-white  text-black border-none outline-none h-14 px-4 text-left text-base rounded-xl">
            <FormControl>
              {!valueKecamatan ? (
                <Label name="Pilih Kecamatan" />
              ) : (
                <div
                  className="absolute right-8 top-5 px-2 z-10 text-gray-500 cursor-pointer"
                  onClick={handleRemoveKecamatan}
                >
                  <FiX size={20} />
                </div>
              )}
              <TextField
                select
                value={valueKecamatan}
                onChange={handleSelect}
                sx={styleSelect}
              >
                <MenuItem value="" disabled>
                  Pilih Kecamatan
                </MenuItem>
                {kecamatanOptions.map((option, key) => (
                  <MenuItem
                    key={key}
                    value={option.value}
                    sx={{
                      fontFamily: "sans-serif",
                    }}
                  >
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            </FormControl>
          </div>
        </span>
        <span className="flex flex-col w-full md:w-[30%] md:pr-4">
          <p className="font-semibold text-lg text-black py-2">Kelurahan</p>
          <div className="flex flex-col w-full bg-white text-black border-none outline-none h-14 px-4 text-left text-base rounded-xl">
            <FormControl>
              {!valueKelurahan ? (
                <Label name="Pilih Kelurahan" />
              ) : (
                <div
                  className="absolute right-8 top-5 px-2 z-10 text-gray-500 cursor-pointer"
                  onClick={handleRemoveKelurahan}
                >
                  <FiX size={20} />
                </div>
              )}
              <TextField
                select
                value={valueKelurahan}
                onChange={handleSelectKelurahan}
                sx={styleSelect}
              >
                <MenuItem value="" disabled>
                  Pilih Kelurahan
                </MenuItem>
                {valueKecamatan &&
                  dataKelurahan.map((option, key) => (
                    <MenuItem
                      key={key}
                      value={option.value}
                      sx={{
                        fontFamily: "sans-serif",
                      }}
                    >
                      {option.label}
                    </MenuItem>
                  ))}
              </TextField>
            </FormControl>
          </div>
        </span>
        <span className="flex flex-col w-full md:w-[20%] md:pr-4">
          <p className="font-semibold text-lg text-black py-2">TPS</p>
          <div className="flex flex-col w-full bg-white text-black border-none outline-none h-14 px-4 text-left text-base rounded-xl">
            <FormControl>
              {!valueTPS ? (
                <Label name="Pilih Kelurahan" />
              ) : (
                <div
                  className="absolute right-8 top-5 px-2 z-10 text-gray-500 cursor-pointer"
                  onClick={handleRemoveTPS}
                >
                  <FiX size={20} />
                </div>
              )}
              <TextField
                select
                value={valueTPS}
                onChange={handleSelectTPS}
                sx={styleSelect}
              >
                <MenuItem value="" disabled>
                  Pilih TPS
                </MenuItem>
                {valueKelurahan &&
                  dataTps.map((option, key) => (
                    <MenuItem
                      key={key}
                      value={option.value}
                      sx={{
                        fontFamily: "sans-serif",
                      }}
                    >
                      {option.label}
                    </MenuItem>
                  ))}
              </TextField>
            </FormControl>
          </div>
        </span>

        <span className="flex flex-col w-full md:w-[20%] mt-6">
          {loading ? (
            <div
              className="flex bg-gray-300 bg w-full h-14 items-center rounded-xl justify-center cursor-pointer"
              onClick={handleSearchData}
            >
              <CircularProgress sx={{ color: "#ffffff" }} size={25} />
              <h1 className="text-white font-bold text-lg pl-2">Loading</h1>
            </div>
          ) : (
            <div
              className="flex bg-primary w-full h-14 items-center rounded-xl justify-center cursor-pointer"
              onClick={handleSearchData}
            >
              <h1 className="text-white font-bold text-lg">Tampilkan</h1>
            </div>
          )}
        </span>
      </div>

      <div className="md:hidden flex flex-wrap items-end justify-between px-8">
        <div
          className={`flex flex-col w-full transition-all duration-500 ease-in-out ${
            searchBox
              ? "max-h-screen opacity-100 translate-y-0"
              : "max-h-0 opacity-0 -translate-y-4"
          } overflow-hidden`}
        >
          <span className="flex flex-col w-full md:w-[30%] md:pr-4">
            <p className="font-semibold text-lg text-black py-2">Kecamatan</p>
            <div className="flex flex-col w-full bg-white text-black border-none outline-none h-14 px-4 text-left text-base rounded-xl">
              <FormControl>
                {!valueKecamatan ? (
                  <Label name="Pilih Kecamatan" />
                ) : (
                  <div
                    className="absolute right-8 top-5 px-2 z-10 text-gray-500 cursor-pointer"
                    onClick={handleRemoveKecamatan}
                  >
                    <FiX size={20} />
                  </div>
                )}

                <TextField
                  select
                  value={valueKecamatan}
                  onChange={handleSelect}
                  sx={styleSelect}
                >
                  <MenuItem value="" disabled>
                    Pilih Kecamatan
                  </MenuItem>
                  {kecamatanOptions.map((option, key) => (
                    <MenuItem
                      key={key}
                      value={option.value}
                      sx={{
                        fontFamily: "sans-serif",
                      }}
                    >
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>
              </FormControl>
            </div>
          </span>
          <span className="flex flex-col w-full md:w-[30%] md:pr-4">
            <p className="font-semibold text-lg text-black py-2">Kelurahan</p>
            <div className="flex flex-col w-full bg-white text-black border-none outline-none h-14 px-4 text-left text-base rounded-xl">
              <FormControl>
                {!valueKelurahan ? (
                  <Label name="Pilih Kelurahan" />
                ) : (
                  <div
                    className="absolute right-8 top-5 px-2 z-10 text-gray-500 cursor-pointer"
                    onClick={handleRemoveKelurahan}
                  >
                    <FiX size={20} />
                  </div>
                )}
                <TextField
                  select
                  value={valueKelurahan}
                  onChange={handleSelectKelurahan}
                  sx={styleSelect}
                >
                  <MenuItem value="" disabled>
                    Pilih Kelurahan
                  </MenuItem>
                  {valueKecamatan &&
                    dataKelurahan.map((option, key) => (
                      <MenuItem
                        key={key}
                        value={option.value}
                        sx={{
                          fontFamily: "sans-serif",
                        }}
                      >
                        {option.label}
                      </MenuItem>
                    ))}
                </TextField>
              </FormControl>
            </div>
          </span>
          <span className="flex flex-col w-full md:w-[20%] md:pr-4">
            <p className="font-semibold text-lg text-black py-2">TPS</p>
            <div className="flex flex-col w-full bg-white text-black border-none outline-none h-14 px-4 text-left text-base rounded-xl">
              <FormControl>
                {!valueTPS ? (
                  <Label name="Pilih Kelurahan" />
                ) : (
                  <div
                    className="absolute right-8 top-5 px-2 z-10 text-gray-500 cursor-pointer"
                    onClick={handleRemoveTPS}
                  >
                    <FiX size={20} />
                  </div>
                )}
                <TextField
                  select
                  value={valueTPS}
                  onChange={handleSelectTPS}
                  sx={styleSelect}
                >
                  <MenuItem value="" disabled>
                    Pilih TPS
                  </MenuItem>
                  {valueKelurahan &&
                    dataTps.map((option, key) => (
                      <MenuItem
                        key={key}
                        value={option.value}
                        sx={{
                          fontFamily: "sans-serif",
                        }}
                      >
                        {option.label}
                      </MenuItem>
                    ))}
                </TextField>
              </FormControl>
            </div>
          </span>
          <span className="flex flex-col w-full md:w-[20%] mt-6">
            <div
              className="flex bg-primary w-full h-14 items-center rounded-xl justify-center"
              onClick={handleSearchData}
            >
              <h1 className="text-white font-bold text-lg">Cari</h1>
            </div>
          </span>
          <div
            onClick={handleClick}
            className="flex flex-col w-full items-center pt-2 cursor-pointer"
          >
            <h1 className="text-gray-400">Sembunyikan</h1>
          </div>
        </div>

        {!searchBox && (
          <div className="md:hidden flex flex-col w-full mt-2 items-center">
            <div
              onClick={handleClick}
              className="bg-primary py-3 flex flex-row w-full justify-center rounded-xl gap-2 cursor-pointer"
            >
              <FaSearch size={24} className="text-white" />
              <h1 className="text-white font-semibold text-lg">Cek Suara</h1>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
