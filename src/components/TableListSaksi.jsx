/* eslint-disable react/prop-types */
import * as React from "react";
import PropTypes from "prop-types";
import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableFooter from "@mui/material/TableFooter";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import LastPageIcon from "@mui/icons-material/LastPage";
import TableHead from "@mui/material/TableHead";
import { useEffect } from "react";
import { useState } from "react";

function TablePaginationActions(props) {
  const theme = useTheme();
  const { count, page, rowsPerPage, onPageChange } = props;

  const handleFirstPageButtonClick = (event) => {
    onPageChange(event, 0);
  };

  const handleBackButtonClick = (event) => {
    onPageChange(event, page - 1);
  };

  const handleNextButtonClick = (event) => {
    onPageChange(event, page + 1);
  };

  const handleLastPageButtonClick = (event) => {
    onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  return (
    <Box sx={{ flexShrink: 0, ml: 2.5 }}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label="first page"
      >
        {theme.direction === "rtl" ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton
        onClick={handleBackButtonClick}
        disabled={page === 0}
        aria-label="previous page"
      >
        {theme.direction === "rtl" ? (
          <KeyboardArrowRight />
        ) : (
          <KeyboardArrowLeft />
        )}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
      >
        {theme.direction === "rtl" ? (
          <KeyboardArrowLeft />
        ) : (
          <KeyboardArrowRight />
        )}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
      >
        {theme.direction === "rtl" ? <FirstPageIcon /> : <LastPageIcon />}
      </IconButton>
    </Box>
  );
}

TablePaginationActions.propTypes = {
  count: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
};

export default function TableListSaksi({
  token,
  setIsOpenModalSaksi,
  setNameKoordinator,
  setHpKoordinator,
}) {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [dataTPS, setDataTPS] = useState([]);

  const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    fetch(`${apiUrl}/tps/saksi`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setDataTPS(data.payload);
      })
  }, [token, apiUrl]);

  function createData(
    kecamatan_name,
    kelurahan_name,
    tps_name,
    user_id,
    name_koordinator,
    hp_koordinator,
    code
  ) {
    return {
      kecamatan_name,
      kelurahan_name,
      tps_name,
      user_id,
      name_koordinator,
      hp_koordinator,
      code,
    };
  }

  const rows = dataTPS.map(
    ({
      kecamatan_name,
      kelurahan_name,
      tps_name,
      user_id,
      name_koordinator,
      hp_koordinator,
      code,
    }) =>
      createData(
        kecamatan_name,
        kelurahan_name,
        tps_name,
        user_id,
        name_koordinator,
        hp_koordinator,
        code
      )
  );

  const tableFirst = (value) => {
    return (
      <TableCell
        component="th"
        scope="row"
        sx={{ fontFamily: "sans-serif", fontSize: 16 }}
        className="cursor-pointer w-[20%]"
      >
        {value}
      </TableCell>
    );
  };

  const tableNumber = (value) => {
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

  const tableCell = (value) => {
    return (
      <TableCell
        component="th"
        scope="row"
        sx={{ fontFamily: "sans-serif", fontSize: 16 }}
        className="cursor-pointer"
      >
        {value}
      </TableCell>
    );
  };

  const tableEdit = (
    kecamatan_name,
    kelurahan_name,
    tps_name,
    user_id,
    name_koordinator,
    hp_koordinator,
    code
  ) => {
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
            kelurahan_name: kelurahan_name,
            tps_name: tps_name,
            user_id: user_id,
            name_koordinator: name_koordinator,
            hp_koordinator: hp_koordinator,
            code: code,
          };
          setNameKoordinator(name_koordinator);
          setHpKoordinator(hp_koordinator);

          setIsOpenModalSaksi(data);
        }}
      >
        <div className="flex w-full justify-center bg-orange-400 text-white rounded-lg">
          <h1 className="px-3 py-1">Edit</h1>
        </div>
      </TableCell>
    );
  };

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <TableContainer component={Paper}>
      <Table aria-label="custom pagination table">
        <TableHead sx={{ backgroundColor: "#008FFB" }}>
          <TableRow>
            <TableCell sx={{ color: "#ffffff" }} align="center">
              No.
            </TableCell>
            <TableCell sx={{ color: "#ffffff" }}>Kecamatan</TableCell>
            <TableCell sx={{ color: "#ffffff" }}>Kelurahan</TableCell>
            <TableCell sx={{ color: "#ffffff" }}>TPS</TableCell>
            <TableCell sx={{ color: "#ffffff" }}>Nama Koordinator</TableCell>
            <TableCell sx={{ color: "#ffffff" }}>Hp Koordinator</TableCell>
            <TableCell sx={{ color: "#ffffff" }} align="center">
              Aksi
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {(rowsPerPage > 0
            ? rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            : rows
          ).map((row, index) => (
            <TableRow
              key={page * rowsPerPage + index}
              sx={{
                "&:hover": {
                  backgroundColor: "#f5f5f5", // Background color on hover
                },
              }}
            >
              {tableNumber(page * rowsPerPage + index + 1)}
              {tableFirst(row.kecamatan_name)}
              {tableCell(row.kelurahan_name)}
              {tableCell(row.tps_name)}
              {tableCell(row.name_koordinator)}
              {tableCell(row.hp_koordinator)}
              {tableEdit(
                row.kecamatan_name,
                row.kelurahan_name,
                row.tps_name,
                row.user_id,
                row.name_koordinator,
                row.hp_koordinator,
                row.code
              )}
            </TableRow>
          ))}
          {emptyRows > 0 && (
            <TableRow style={{ height: 53 * emptyRows }}>
              <TableCell colSpan={6} />
            </TableRow>
          )}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25, { label: "All", value: -1 }]}
              colSpan={7}
              count={rows.length}
              rowsPerPage={rowsPerPage}
              page={page}
              slotProps={{
                select: {
                  inputProps: {
                    "aria-label": "rows per page",
                    fontFamily: "sans-serif",
                  },
                },
              }}
              sx={{
                "& .MuiTablePagination-displayedRows": {
                  fontFamily: "sans-serif",
                },
                "& .MuiTablePagination-selectLabel": {
                  fontFamily: "sans-serif",
                },
                "& .MuiTablePagination-select": {
                  fontFamily: "sans-serif",
                },
              }}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              ActionsComponent={TablePaginationActions}
            />
          </TableRow>
        </TableFooter>
      </Table>
    </TableContainer>
  );
}
