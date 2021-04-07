import styles from "./App.module.css";
import { Records } from "./pages";

const App = () => {
  return (
    <main className={styles.app}>
      <h1 className={styles.title}>Gregs Records</h1>
      <h2 className={styles.subTitle}>My record collection</h2>
      <Records />
    </main>
  );
};

export default App;
