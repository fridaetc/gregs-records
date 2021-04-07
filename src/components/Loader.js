import { MdCached } from "react-icons/md";
import styles from "./Loader.module.css";

const Loader = () => {
  return (
    <MdCached data-testid="loader" className={styles.loader} size="1.5em" />
  );
};

export default Loader;
