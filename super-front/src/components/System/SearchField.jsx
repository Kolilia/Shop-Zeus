import { TextField } from "@material-ui/core";
import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { useDebounce } from "../../hooks/useDebounce";

let isChanged = false;

const SearchField = ({ onSearch, defaultValue, placeholder, variant }) => {
  const [value, setValue] = useState(defaultValue);

  const debouncedValue = useDebounce(value, 500);

  const isLoad = useRef(false);

  useEffect(() => {
    setValue(defaultValue);
  }, [defaultValue]);

  const onChange = (event) => {
    isLoad.current = true;

    setValue(event.target.value);

    isChanged = true;
  };

  const fetch = useCallback(
    (debouncedValue) => {
      onSearch(debouncedValue);
    },
    [onSearch]
  );

  useEffect(() => {
    if (isChanged && isLoad.current) {
      isLoad.current = false;
      fetch(debouncedValue);
    }
  }, [fetch, debouncedValue]);

  useLayoutEffect(() => {
    return () => {
      isChanged = false;
    };
  }, []);

  return (
    <TextField
      placeholder={placeholder || "Поиск..."}
      value={value || ""}
      inputProps={{ "aria-label": "поиск" }}
      style={{ fontFamily: "'Montserrat', sans-serif" }}
      variant={variant || "outlined"}
      onChange={onChange}
      fullWidth
    />
  );
};

export default SearchField;
