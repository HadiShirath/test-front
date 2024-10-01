/* eslint-disable react/prop-types */
import {
  MenuItem,
  FormControl,
  ListItemText,
  Select,
  Checkbox,
  InputLabel,
} from "@mui/material";

export default function MultipleSelectCheckmarks({
  data,
  setValue,
  personName,
  setPersonName,
  isNumberKecamatan,
}) {


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

  if (isNumberKecamatan) {
    data = data.reduce((acc, curr) => {
      // Cari kecamatan yang sudah ada di accumulator
      const existingKecamatan = acc.find(
        (item) => item.kecamatan_name === curr.kecamatan_name
      );

      if (existingKecamatan) {
        // Jika sudah ada, tambahkan user ke array
        existingKecamatan.username.push(curr.username);
      } else {
        // Jika belum ada, buat entry baru
        acc.push({
          kecamatan_name: curr.kecamatan_name,
          username: [curr.username],
        });
      }

      return acc;
    }, []);
  } 

  const handleChange = (event) => {
    const { value } = event.target;

    var newValue = Array.isArray(value) ? value : value.split(",");

    if (isNumberKecamatan) {
      if (newValue.length > 1) {
        let valueOriginal = newValue.slice(0, -1);
        const personName = newValue[newValue.length - 1];

        const exists = valueOriginal.some((arr) => {
          return JSON.stringify(arr) === JSON.stringify(personName);
        });

        if (exists) {
          valueOriginal = valueOriginal.filter((arr) => {
            return JSON.stringify(arr) !== JSON.stringify(personName);
          });
        } else {
          valueOriginal = [...valueOriginal, personName];
        }

        setPersonName(valueOriginal);
        setValue(valueOriginal.flat());
      } else {
        setPersonName(newValue);
        setValue(newValue);
      }
    } else {
      if (newValue.includes("")) {
        const allUsernames = data.map((v) => v.username);
        const isAllSelected = newValue.length === allUsernames.length + 1; // Cek jika semua sudah terpilih
        setPersonName(isAllSelected ? [] : allUsernames);
        setValue(isAllSelected ? [] : allUsernames);
      } else {
        setPersonName(newValue);
        setValue(newValue);
      }
    }
  };


  // MuiButtonBase-root-MuiMenuItem-root
  const styleSelect = {
    "& .MuiSelect-select": {
      fontFamily: "sans-serif",
    },
    "& .MuiOutlinedInput-root": {
      border: "none",
      "& fieldset": {
        border: "none",
      },
    },
    "& .MuiTypography-root": {
      fontFamily: "sans-serif",
    },

    "& .MuiInputLabel-root": {
      fontFamily: "sans-serif",
    },
    "& .MuiFormLabel-root": {
      fontFamily: "sans-serif",
    },
    "&.Mui-focused": {
      color: "#000000",
    },
  };

  return (
    <div className="flex flex-col w-full">
      {!isNumberKecamatan ? (
        <FormControl sx={styleSelect} className="bg-gray-100 rounded-xl">
          {personName.length === 0 && (
            <InputLabel shrink={personName.length > 0} sx={styleSelect}>
              Pilih Kontak
            </InputLabel>
          )}
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

            {data.map((value) => {
              return (
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
              );
            })}
          </Select>
        </FormControl>
      ) : (
        <FormControl sx={styleSelect} className="bg-gray-100 rounded-xl">
          {personName.length === 0 && (
            <InputLabel shrink={personName.length > 0} sx={styleSelect}>
              Pilih Kontak
            </InputLabel>
          )}
          <Select
            multiple
            value={personName}
            onChange={handleChange}
            renderValue={(selected) => selected.join(", ")}
            sx={styleSelect}
            MenuProps={MenuProps}
          >
            {data.map((value) => {
              return (
                <MenuItem
                  key={value.kecamatan_name}
                  value={value.username}
                  className="flex flex-row"
                >
                  <Checkbox
                    checked={personName.some((arr) =>
                      value.username.every((item) => arr.includes(item))
                    )}
                  />
                  <div className="flex flex-col w-full">
                    <div className="flex flex-row w-full items-start justify-start">
                      <ListItemText
                        primary={`${value.kecamatan_name}`}
                        sx={styleSelect}
                      />
                    </div>
                  </div>
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>
      )}
    </div>
  );
}
