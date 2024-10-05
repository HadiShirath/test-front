/* eslint-disable react/prop-types */
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Swal from 'sweetalert2';
import Cookies from "js-cookie";

export default function TableListUser({ dataUser, setFullname, setUsername, setIsOpenModalUser }) {

  const apiUrl = import.meta.env.VITE_API_URL;
  const token = Cookies.get("access_token");
  
  function createData(id, fullname, username, password_decoded, role) {
    return {
      id,
      fullname,
      username,
      password_decoded,
      role,
    };
  }

  const rows = dataUser.map(({ public_id, fullname, username, password_decoded, role }) =>
    createData(public_id, fullname, username, password_decoded, role)
  );

  const tableCellFirst = (value) => {
    return (
      <TableCell
        component="th"
        scope="row"
        sx={{ fontFamily: "sans-serif", fontSize: 16 }}
        className="cursor-pointer"
        align="left"
      >
        {value}
      </TableCell>
    );
  };

  const tableCell = (value) => {
    return (
      <TableCell
        component="th"
        scope="row"
        sx={{ fontFamily: "sans-serif", fontSize: 16 }}
        className="cursor-pointer"
        align="center"
      >
        {value}
      </TableCell>
    );
  };

  const tableCellPassword = (value) => {
    let maskedData = "*".repeat(value.length);
    return (
      <TableCell
        component="th"
        scope="row"
        sx={{ fontFamily: "sans-serif", fontSize: 16 }}
        className="cursor-pointer"
        align="center"
      >
        {maskedData}
      </TableCell>
    );
  };

  const handleValidateDelete = (id) => {
    Swal.fire({
      title: "Hapus Akun User",
      text: "Apakah anda yakin?",
      // icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yakin",
      confirmButtonColor: "#ef4444",
      focusConfirm: false,
      cancelButtonText: "Batal",
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {

        fetch(`${apiUrl}/users/${id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
          .then((response) => response.json())
          .then((data) => {
            if (data.success) {
              Swal.fire({
                title: "Berhasil",
                text: "Berhasil menghapus user",
                icon: "success",
                showConfirmButton: false,
                timer: 2000,
              });
  
              setTimeout(() => {
                window.location.reload();
              }, 2000);
            }
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

      }
    });
  }

  const tableCellEdit = (id, fullname, username) => {
    return (
      <TableCell
        component="th"
        scope="row"
        sx={{ fontFamily: "sans-serif", fontSize: 16 }}
        className="cursor-pointer w-32"
        align="center"
        
      >

      <div className="flex flex-row">

        <div className="flex justify-center bg-orange-400 text-white rounded-lg mr-2" onClick={() => {
          const data = {
            id: id,
            fullname: fullname,
            username: username,

          }

          setFullname(fullname)
          setUsername(username)

          setIsOpenModalUser(data)
        }}>
          <h1 className="px-6 py-1">Edit</h1>
        </div>

        <div className="flex justify-center bg-red-500 text-white rounded-lg" onClick={() => handleValidateDelete(id)}>
          <h1 className="px-4 py-1">Hapus</h1>
        </div>
      </div>



      </TableCell>
    );
  };

  const tableTitleFirst = (value) => {
    return <TableCell sx={{ color: "#ffffff" }}>{value}</TableCell>;
  };

  const tableTitle = (value) => {
    return (
      <TableCell sx={{ color: "#ffffff" }} align="center">
        {value}
      </TableCell>
    );
  };

  return (
    <>
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead sx={{ backgroundColor: "#008FFB" }}>
          <TableRow>
            {tableTitle("No.")}
            {tableTitleFirst("Nama Lengkap")}
            {tableTitle("Username")}
            {tableTitle("Password")}
            {tableTitle("Status")}
            {tableTitle("Aksi")}
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
              {tableCell(key + 1)}
              {tableCellFirst(row.fullname)}
              {tableCell(row.username)}
              {tableCellPassword(row.password_decoded)}
              {tableCell(row.role)}
              {tableCellEdit(row.id, row.fullname, row.username)}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
        {rows.length === 0 && <div className="flex flex-col w-full items-center py-2"> 
          <h1 className="text-lg text-gray-400 italic">Data User Kosong</h1>
        </div>}
    </>
  );
}
