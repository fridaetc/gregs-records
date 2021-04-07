import PropTypes from "prop-types";
import styles from "./Button.module.css";

const Button = ({ loading, onClick, value }) => {
  return (
    <button className={styles.button} onClick={onClick}>
      {value}
      {loading && "..."}
    </button>
  );
};

Button.propTypes = {
  loading: PropTypes.bool,
  onClick: PropTypes.func,
  value: PropTypes.string.isRequired,
};

export default Button;
