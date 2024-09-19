/* eslint-disable react/prop-types */
import { FaHome } from "react-icons/fa";
import { useParams } from "react-router-dom";
import { useNavigate} from "react-router-dom";

export default function Breadcrumbs({
  valueKecamatan,
  valueKelurahan,
  valueTps,
  photo,
  table,
  admin,
}) {
  const { kecamatan, kelurahan, tps } = useParams();
  const navigate = useNavigate();

  // Menentukan status aktif berdasarkan props
  const activeHome = !photo && !valueKecamatan && !kelurahan && !valueTps;
  const activeKecamatan =
    !photo && !valueKelurahan && !valueTps && valueKecamatan;
  const activeKelurahan = !photo && !valueTps && valueKelurahan;
  const activeTPS = !photo && valueTps;
  const activePhoto = photo;

  const handleHome = () => {
    if (admin && !table){
      navigate(`/admin/dashboard`);
    } else if (admin && table) {
      navigate(`/admin/table`);
    }
    else if (table) {
      navigate(`/user/table`);
    } else {
      navigate(`/user`);
    }
  };

  const handleKecamatan = () => {
    if(admin && !table){
      navigate(`/admin/dashboard/${kecamatan}`);
    }
    else if (admin && table){
      navigate(`/admin/table/${kecamatan}`);
    }
    else if (table) {
      navigate(`/user/table/${kecamatan}`);
    } else {
      navigate(`/user/${kecamatan}`);
    }
  };

  const handleKelurahan = () => {
    if(admin && !table){
      navigate(`/admin/dashboard/${kecamatan}/${kelurahan}`);
    }
    else if (admin && table){
      navigate(`/admin/table/${kecamatan}/${kelurahan}`);
    }
    else if (table) {
      navigate(`/user/table/${kecamatan}/${kelurahan}`);
    } else {
      navigate(`/user/${kecamatan}/${kelurahan}`);
    }
  };
  
  const handleTPS = () => {
    if(admin && !table){
      navigate(`/admin/dashboard/${kecamatan}/${kelurahan}/${tps}`);
    }
    else if (admin && table){
      navigate(`/admin/table/${kecamatan}/${kelurahan}/${tps}`);
    }
    else if (table) {
      navigate(`/user/table/${kecamatan}/${kelurahan}/${tps}`);
    } else {
      navigate(`/user/${kecamatan}/${kelurahan}/${tps}`);
    }
  };

  return (
    <div className="flex flex-row items-center text-gray-500 px-6">
      <div className="flex flex-row items-start pb-6">
        <div
          onClick={handleHome}
          className={`${
            activeHome ? "text-primary" : ""
          } flex flex-row cursor-pointer hover:text-primary text-lg`}
        >
          <FaHome
            className={`text-xl ${activeHome ? "text-primary" : ""} mr-2`}
            size={24}
          />
          {!kecamatan && !kelurahan && !tps && <span className="flex md:hidden">Beranda</span>}
          <span className="hidden md:flex">Beranda</span>
        </div>
        <div className="flex flex-wrap items-center text-lg">
          {kecamatan && (
            <div className="flex flex-row items-center">
              <span className="mx-1">-</span>
              <span
                onClick={handleKecamatan}
                className={`${
                  activeKecamatan ? "text-primary" : ""
                } cursor-pointer hover:text-primary`}
              >
                {valueKecamatan}
              </span>
            </div>
          )}
          {kelurahan && (
            <div className="flex flex-row items-center text-lg">
              <span className="mx-1">-</span>
              <span
                onClick={handleKelurahan}
                className={`${
                  activeKelurahan ? "text-primary" : ""
                } cursor-pointer hover:text-primary`}
              >
                {valueKelurahan}
              </span>
            </div>
          )}
          {tps && (
            <div className="flex flex-row items-center text-lg">
              <span className="mx-1">-</span>
              <span
                onClick={handleTPS}
                className={`${
                  activeTPS ? "text-primary" : ""
                } cursor-pointer hover:text-primary`}
              >
                {valueTps}
              </span>
            </div>
          )}
          {photo && (
            <div className="flex flex-row items-center">
              <span className="mx-1">-</span>
              <span
                onClick={() => alert("TPS clicked")}
                className={`${
                  activePhoto ? "text-primary" : ""
                } cursor-pointer`}
              >
                Photo
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
