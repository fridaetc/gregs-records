import { useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";
import _debounce from "lodash.debounce";
import Loader from "components/Loader";
import styles from "./SearchInput.module.css";

const SearchInput = ({ onDebouncedSearch, onSearchStart, loading }) => {
  const [value, setValue] = useState("");
  const [seachStarted, setSearchStarted] = useState(false);

  //Tell parent search started when its changed from false to true
  useEffect(() => {
    if (seachStarted) {
      onSearchStart();
    }
  }, [onSearchStart, seachStarted]);

  //Memoize debounce so its not recreated every time
  const debouncedSearch = useMemo(
    () =>
      _debounce((newValue) => {
        onDebouncedSearch(newValue);
        setSearchStarted(false);
      }, 500),
    [onDebouncedSearch]
  );

  const updateValue = (e) => {
    setSearchStarted(true);

    //Set value so input updates
    setValue(e.target.value);
    //Debounce to only execute search when user is done typing
    debouncedSearch(e.target.value);
  };

  //Reset search if esc click
  const handleInputKeyDown = (e) => {
    if ((e.keyCode || e.which) === 27) updateValue({ target: { value: "" } });
  };

  return (
    <div className={styles.searchInput}>
      <input
        data-testid="search-input"
        onKeyDown={handleInputKeyDown}
        className={styles.input}
        value={value}
        onChange={updateValue}
        placeholder="Search"
      />
      <span className={styles.loader}>{loading && <Loader />}</span>
    </div>
  );
};

SearchInput.propTypes = {
  onDebouncedSearch: PropTypes.func.isRequired,
  onSearchStart: PropTypes.func.isRequired,
  loading: PropTypes.bool,
};

export default SearchInput;
