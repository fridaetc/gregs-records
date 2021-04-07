import { render, screen } from "@testing-library/react";
import Loader from "../Loader";

describe("renders loader", () => {
  it("renders loader", async () => {
    render(<Loader />);

    screen.getByTestId("loader");
  });
});
