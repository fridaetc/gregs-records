import { render, screen, fireEvent } from "@testing-library/react";
import Notification from "../Notification";

describe("renders notification", () => {
  it("renders error notification", async () => {
    const { container } = render(<Notification text="Meh" type="error" />);

    screen.getByText("Meh");
    expect(container.firstChild).toHaveClass("error");
  });

  it("renders default (success) notification", async () => {
    const { container } = render(<Notification text="Yeaaah" />);

    screen.getByText("Yeaaah");
    expect(container.firstChild).toHaveClass("success");
  });

  it("renders notification with reload button", async () => {
    const click = jest.fn();
    const { container } = render(
      <Notification
        text="Reload this"
        action={{ text: "Reload", onClick: click }}
      />
    );

    screen.getByText("Reload this");
    fireEvent.click(screen.getByTitle("Reload"));
    expect(click).toHaveBeenCalledTimes(1);
  });
});
