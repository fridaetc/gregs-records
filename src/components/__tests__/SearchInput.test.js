import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import SearchInput from "../SearchInput";

describe("renders searchinput", () => {
  const onDebouncedSearch = jest.fn();
  const onSearchStart = jest.fn();
  it("renders input", () => {
    render(
      <SearchInput
        onDebouncedSearch={onDebouncedSearch}
        onSearchStart={onSearchStart}
      />
    );

    screen.getByTestId("search-input");
  });
  it("renders loader on loading", () => {
    render(
      <SearchInput
        onDebouncedSearch={onDebouncedSearch}
        onSearchStart={onSearchStart}
        loading={true}
      />
    );

    screen.getByTestId("search-input");
    screen.getByTestId("loader");
  });
  it("changes value on typing", async () => {
    render(
      <SearchInput
        onDebouncedSearch={onDebouncedSearch}
        onSearchStart={onSearchStart}
      />
    );

    const input = screen.getByTestId("search-input");

    fireEvent.change(input, {
      target: { value: "hey" },
    });
    fireEvent.change(input, {
      target: { value: "bye" },
    });

    expect(input.value).toBe("bye");
    expect(onSearchStart).toHaveBeenCalledTimes(1);
    await waitFor(() => expect(onDebouncedSearch).toHaveBeenCalledTimes(1));
  });
  it("resets search on esc", async () => {
    render(
      <SearchInput
        onDebouncedSearch={onDebouncedSearch}
        onSearchStart={onSearchStart}
      />
    );

    const input = screen.getByTestId("search-input");
    fireEvent.change(input, {
      target: { value: "hey" },
    });

    expect(input.value).toBe("hey");

    fireEvent.keyDown(input, {
      key: "Escape",
      code: "Escape",
      keyCode: 27,
      charCode: 27,
    });
    expect(input.value).toBe("");
  });
});
