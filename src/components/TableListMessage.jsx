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
import Tooltip from '@mui/material/Tooltip';

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

export default function TableListMessage({ data, inbox, outbox }) {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  function createData(id, number_phone, message, created_at, updated_at) {
    return { id, number_phone, message, created_at, updated_at };
  }

  function createDataOutbox(
    id,
    number_phone,
    number_phones,
    message,
    processed,
    created_at,
    updated_at
  ) {
    return { id, number_phone, number_phones, message, processed, created_at, updated_at };
  }



  const rows = inbox
    ? data.map(({ id, sender_number, message, created_at, updated_at }) =>
        createData(id, sender_number, message, created_at, updated_at)
      )
    : data.map(
        ({ id, receiver_number, receiver_numbers, message, processed, created_at, updated_at }) =>
          createDataOutbox(
            id,
            receiver_number,
            receiver_numbers,
            message,
            processed,
            created_at,
            updated_at
          )
      );

      const styleSelect = {
        "& .MuiTooltip-tooltip": {
          fontFamily: "sans-serif",
          backgroundColor: "#ffffff"
        },
      };

  const tableFirst = (value) => {
    var newValue;

    if (Array.isArray(value)) {
      newValue = value.join(", ")
  } else {
      newValue = value
  }
    return (
      <Tooltip title={Array.isArray(value) ? newValue : ""} arrow sx={styleSelect}>
      <TableCell
        component="th"
        scope="row"
        sx={{
          fontFamily: "sans-serif",
          fontSize: 16,
          whiteSpace: "nowrap",        
          overflow: "hidden",         
          textOverflow: "ellipsis",   
          maxWidth: "200px",          
      }}
        className="cursor-pointer"
      >
        {newValue}
      </TableCell>
      </Tooltip>
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

  const tableTime = (value) => {
    const formattedTimeSplit = value ? value.split(",") : value;
    const date = formattedTimeSplit ? formattedTimeSplit[0] : "";
    const time = formattedTimeSplit ? formattedTimeSplit[1] : "";

    return (
      <TableCell
        component="th"
        scope="row"
        sx={{ fontFamily: "sans-serif", fontSize: 16 }}
        className="cursor-pointer"
        align="center"
      >
        <div className="flex flex-col px-12">
          <div>{date}</div>
          <h1 className="text-gray-400">{time}</h1>
        </div>
      </TableCell>
    );
  };

  const tableStatus = () => {
    return (
      <TableCell
        sx={{ fontFamily: "sans-serif", fontSize: 16 }}
        className="cursor-pointer"
        align="center"
      >
        <div className="bg-green-100 mx-8 rounded-md">
          <h1 className="text-green-800 py-2 px-4">Masuk</h1>
        </div>
      </TableCell>
    );
  };

  const tableStatusOutbox = (status) => {
    return (
      <TableCell
        sx={{ fontFamily: "sans-serif", fontSize: 16 }}
        className="cursor-pointer"
        align="center"
      >
        <div
          className={`${status ? "bg-green-100" : "bg-orange-100"} mx-8 rounded-md`}
        >
          <h1
            className={`${status ? "text-green-800" : "text-orange-500 px-4"} py-2`}
          >
            {status ? "Terkirim" : "Pending"}
          </h1>
        </div>
      </TableCell>
    );
  };

  const tableCell = (value) => {
    return (
      <TableCell
        component="th"
        scope="row"
        sx={{
          fontFamily: "sans-serif",
          fontSize: 16,
          maxWidth: 250,
          overflow: 'hidden',
        }}
        className="cursor-pointer"
      >
        {value}
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
            <TableCell sx={{ color: "#ffffff" }}>
              {inbox ? "Pengirim" : "Penerima"}
            </TableCell>
            <TableCell sx={{ color: "#ffffff" }}>Pesan</TableCell>
            <TableCell sx={{ color: "#ffffff" }} align="center">
              Tanggal
            </TableCell>
            <TableCell sx={{ color: "#ffffff" }} align="center">
              Status
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {(rowsPerPage > 0
            ? rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            : rows
          ).map((row, index) => {
            return (
            <TableRow
              key={page * rowsPerPage + index}
              sx={{
                "&:hover": {
                  backgroundColor: "#f5f5f5", // Background color on hover
                },
              }}
            >
              {tableNumber(page * rowsPerPage + index + 1)}
              {tableFirst(row.number_phone !== "" ? row.number_phone : row.number_phones)}
              {tableCell(row.message)}
              {tableTime(row.created_at)}
              {inbox && tableStatus()}
              {outbox && tableStatusOutbox(row.processed)}
            </TableRow>
          )})}
          
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
