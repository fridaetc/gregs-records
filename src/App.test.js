import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders titles", () => {
  render(<App />);
  screen.getByText("Gregs Records");
  screen.getByText("My record collection");
});
