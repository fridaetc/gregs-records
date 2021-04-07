import { render, screen, fireEvent } from "@testing-library/react";
import Button from "../Button";

describe("renders button", () => {
  it("renders button", async () => {
    render(<Button value="Click me" />);

    screen.getByText("Click me");
  });
  it("renders button loading", async () => {
    render(<Button value="Click me" loading />);

    screen.getByText("Click me...");
  });
  it("handles button click", async () => {
    const click = jest.fn();
    render(<Button value="Click me" onClick={click} />);

    fireEvent.click(screen.getByText("Click me"));
    expect(click).toHaveBeenCalledTimes(1);
  });
});
