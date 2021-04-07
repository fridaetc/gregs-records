import PropTypes from "prop-types";
import styles from "./Notification.module.css";
import { MdCached } from "react-icons/md";

const Notification = ({ text, type, action }) => {
  return (
    <div className={`${styles.notification} ${styles[type]}`}>
      {text}{" "}
      {action && (
        <MdCached
          className={styles.reload}
          size="1.5em"
          onClick={action.onClick}
          title={action.text}
        />
      )}
    </div>
  );
};

Notification.propTypes = {
  text: PropTypes.string.isRequired,
  type: PropTypes.string,
  action: PropTypes.object,
};

Notification.defaultProps = {
  type: "success",
};

export default Notification;
