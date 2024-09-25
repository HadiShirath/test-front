/* eslint-disable react/prop-types */
import { useState } from "react";
import {
  MenuItem,
  FormControl,
  ListItemText,
  Select,
  Checkbox,
  InputLabel,
} from "@mui/material";

export default function MultipleSelectCheckmarks({ data, setValue }) {
  const [personName, setPersonName] = useState([]);

  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 250,
      },
    },
  };

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;

    const newValue = typeof value === "string" ? value.split(",") : value;

    if (newValue.includes("")) {
      const allUsernames = data.map((v) => v.username);
      const isAllSelected = newValue.length === allUsernames.length + 1; // Cek jika semua sudah terpilih
      setPersonName(isAllSelected ? [] : allUsernames);
      setValue(isAllSelected ? [] : allUsernames);
    } else {
      setPersonName(newValue);
      setValue(newValue);
    }
  };

  // MuiButtonBase-root-MuiMenuItem-root
  const styleSelect = {
    "& .MuiSelect-select": {
      fontFamily: "sans-serif",
    },
    "& .MuiOutlinedInput-root": {
      border: "none", // Hapus border pada input
      "& fieldset": {
        border: "none", // Hapus border pada fieldset
      },
    },
    "& .MuiTypography-root": {
      fontFamily: "sans-serif", // Ganti dengan font-family yang diinginkan
    },

    "& .MuiInputLabel-root": {
      fontFamily: "sans-serif",
    },
    "& .MuiFormLabel-root": {
      fontFamily: "sans-serif",
    },
    '&.Mui-focused': { 
      color: '#000000'
    }
  };

  return (
    <div className="flex flex-col w-full">


      <FormControl sx={styleSelect} className="bg-gray-100 rounded-xl">
         {personName.length === 0 && <InputLabel shrink={personName.length > 0} sx={styleSelect}>Pilih Kontak</InputLabel>}
        <Select
          multiple
          value={personName}
          onChange={handleChange}
          renderValue={(selected) => selected.join(", ")}
          sx={styleSelect}
          MenuProps={MenuProps}
        >
          <MenuItem value="" sx={styleSelect}>
            <Checkbox checked={personName.length === data.length} />
            <h1 className="font-sans font-bold">Pilih Semua</h1>
          </MenuItem>

          {data.map((value) => (
            <MenuItem
              key={value.username}
              value={value.username}
              className="flex flex-row"
            >
              <Checkbox checked={personName.includes(value.username)} />
              <div className="flex flex-col w-full">
                <div className="flex flex-row w-full items-start justify-start">
                  <ListItemText
                    primary={`${value.username} (${value.fullname})`}
                    sx={styleSelect}
                  />
                </div>
                <h1 className="text-gray-400 font-sans">
                  {value.kecamatan_name}, {value.kelurahan_name},{" "}
                  {value.tps_name}
                </h1>
              </div>
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
}
