/* eslint-disable react/prop-types */
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { useNavigate, useLocation } from "react-router-dom";

export default function StickyHeadTable({
  data,
  kecamatan,
  kelurahan,
  tps,
  admin,
  navigateAdmin,
  disableTableNavigation,
  setIsOpenModalEdit,
  setPaslon1,
  setPaslon2,
  setPaslon3,
  setPaslon4,
  setSuaraSah,
  setSuaraTidakSah,
}) {
  const navigate = useNavigate();
  const location = useLocation();

  const currentURL = location.pathname;

  const handleNavigation = (code) => {  
    if(disableTableNavigation){
      navigate(`${currentURL}`);
    } else if (tps) {      
      const result = currentURL.replace('/table', admin || navigateAdmin ? '/dashboard': "");
      navigate(`${result}/${code}/photo`);
    } else  {
      navigate(`${currentURL}/${code}`);
    } 
  };

  const tableCellKecamatan = (value, code) => {
    return (
      <TableCell
        component="th"
        scope="row"
        sx={{ fontFamily: "sans-serif", fontSize: 16 }}
        className="cursor-pointer"
        align="left"
        onClick={() => handleNavigation(code)}
      >
        {value}
      </TableCell>
    );
  };

  const tableCell = (value, code) => {
    return (
      <TableCell
        component="th"
        scope="row"
        sx={{ fontFamily: "sans-serif", fontSize: 16 }}
        className="cursor-pointer"
        align="center"
        onClick={() => handleNavigation(code)}
      >
        {value}
      </TableCell>
    );
  };

  const tablePP = (value, code) => {
    return (
      <TableCell
        component="th"
        scope="row"
        sx={{ fontFamily: "sans-serif", fontSize: 16 }}
        className="cursor-pointer"
        align="center"
        onClick={() => handleNavigation(code)}
      >
        {value}%
      </TableCell>
    );
  };

  const tableEdit = (kecamatan_name, kelurahan_name, tps_id, tps_name, paslon1, paslon2, paslon3, paslon4, suara_sah, suara_tidak_sah, photo, code) => {
    return (
      <TableCell
        component="th"
        scope="row"
        sx={{ fontFamily: "sans-serif", fontSize: 16 }}
        className="cursor-pointer"
        align="center"
        onClick={() => {
          const data = {
            kecamatan_name: kecamatan_name,
            kelurahan_name:kelurahan_name,
            tps_id : tps_id,
            tps_name: tps_name,
            paslon1: paslon1,
            paslon2: paslon2,
            paslon3: paslon3,
            paslon4: paslon4,
            suara_sah: suara_sah,
            suara_tidak_sah: suara_tidak_sah,
            code : code,
            photo: photo,
          }
          setPaslon1(paslon1)
          setPaslon2(paslon2)
          setPaslon3(paslon3)
          setPaslon4(paslon4)

          const jumlahSuaraSah = paslon1 + paslon2 + paslon3 + paslon4
          setSuaraSah(jumlahSuaraSah)
          setSuaraTidakSah(suara_tidak_sah)
          

          setIsOpenModalEdit(data)
        }}
      >
        <div className="flex w-full justify-center bg-orange-400 p-1 text-white rounded-lg">
          Edit
        </div>
      </TableCell>
    );
  };

  

  const rows = admin
    ? data.map(
        ({
          kecamatan_name,
          kelurahan_name,
          tps_id,
          tps_name,
          paslon1,
          paslon2,
          paslon3,
          paslon4,
          suara_sah,
          suara_tidak_sah,
          total_voters,
          photo,
          pp,
          code,
        }) => {
          return {
            kecamatan_name,
            kelurahan_name,
            tps_id,
            tps_name,
            paslon1,
            paslon2,
            paslon3,
            paslon4,
            suara_sah,
            suara_tidak_sah,
            total_voters,
            photo,
            pp,
            code,
          };
        }
      )
    : tps
    ? data.map(
        ({
          tps_name,
          paslon1,
          paslon2,
          paslon3,
          paslon4,
          suara_sah,
          suara_tidak_sah,
          total_voters,
          sudah,
          belum,
          pp,
          code,
        }) => {
          return {
            tps_name,
            paslon1,
            paslon2,
            paslon3,
            paslon4,
            suara_sah,
            suara_tidak_sah,
            total_voters,
            sudah,
            belum,
            pp,
            code,
          };
        }
      )
    : kelurahan
    ? data.map(
        ({
          kelurahan_name,
          paslon1,
          paslon2,
          paslon3,
          paslon4,
          suara_sah,
          suara_tidak_sah,
          total_voters,
          total_tps,
          sudah,
          belum,
          pp,
          code,
        }) => {
          return {
            kelurahan_name,
            paslon1,
            paslon2,
            paslon3,
            paslon4,
            suara_sah,
            suara_tidak_sah,
            total_voters,
            total_tps,
            sudah,
            belum,
            pp,
            code,
          };
        }
      )
    : data.map(
        ({
          kecamatan_name,
          paslon1,
          paslon2,
          paslon3,
          paslon4,
          suara_sah,
          suara_tidak_sah,
          total_voters,
          total_tps,
          sudah,
          belum,
          pp,
          code,
        }) => {
          return {
            kecamatan_name,
            paslon1,
            paslon2,
            paslon3,
            paslon4,
            suara_sah,
            suara_tidak_sah,
            total_voters,
            total_tps,
            sudah,
            belum,
            pp,
            code,
          };
        }
      );

  const tableTitleFirst = (value) => {
    return (
      <TableCell sx={{ color: "#ffffff" }}>
        {value}
      </TableCell>
    );
  };

  const tableTitle = (value) => {
    return (
      <TableCell sx={{ color: "#ffffff" }} align="center">
        {value}
      </TableCell>
    );
  };

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead sx={{ backgroundColor: "#008FFB" }}>
          <TableRow>
            {!admin && tableTitleFirst(tps ? "TPS" : kelurahan ? "Kelurahan" : "Kecamatan")}
            {admin && tableTitleFirst("Kecamatan")}
            {admin && tableTitleFirst("Kelurahan")}
            {admin && tableTitleFirst("TPS")}
            {tableTitle("Paslon1")}
            {tableTitle("Paslon2")}
            {tableTitle("Paslon3")}
            {tableTitle("Paslon4")}
            {tableTitle("Suara Sah")}
            {tableTitle("Suara Tidak Sah")}
            {tableTitle("DPT")}
            {!tps && tableTitle("TPS")}
            {!admin && tableTitle("Sudah")}
            {!admin && tableTitle("Belum")}
            {tableTitle("PP")}
            {admin && tableTitle("Action")}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row, key) => (
            <TableRow
              key={key}
              sx={{
                "&:hover": {
                  backgroundColor: "#f5f5f5", // Background color on hover
                },
              }}
            >
              {kecamatan &&
                !kelurahan &&
                tableCellKecamatan(row.kecamatan_name, row.code)}
              {admin && tableCellKecamatan(row.kecamatan_name, row.code)}
              {kelurahan && tableCellKecamatan(row.kelurahan_name, row.code)}
              {tps && tableCellKecamatan(row.tps_name, row.code)}

              {tableCell(row.paslon1, row.code)}
              {tableCell(row.paslon2, row.code)}
              {tableCell(row.paslon3, row.code)}
              {tableCell(row.paslon4, row.code)}
              {tableCell(row.suara_sah, row.code)}
              {tableCell(row.suara_tidak_sah, row.code)}
              {tableCell(row.total_voters, row.code)}
              {!tps && tableCell(row.total_tps, row.code)}
              {!admin && tableCell(row.sudah, row.code)}
              {!admin && tableCell(row.belum, row.code)}
              {tablePP(row.pp, row.code)}
              {admin && tableEdit(row.kecamatan_name, row.kelurahan_name, row.tps_id, row.tps_name, row.paslon1, row.paslon2, row.paslon3, row.paslon4, row.suara_sah, row.suara_tidak_sah, row.photo, row.code)}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
