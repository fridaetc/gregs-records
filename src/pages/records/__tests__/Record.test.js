import { render, screen, fireEvent } from "@testing-library/react";
import Record from "../Record";

const mockRecord = {
  id: 1,
  album_title: "Album 1",
  year: 2001,
  condition: "poor",
  show: true,
  artist: 0,
};

const mockArtist = { name: "Artist 1", id: 0 };

describe("renders uneditable record", () => {
  it("renders record with values", () => {
    render(<Record record={mockRecord} artist={mockArtist} />);
    screen.getByText("Album 1");
    screen.getByText("2001");
    screen.getByText("poor");
    screen.getByText("Artist 1");
    expect(screen.queryByTestId("edit")).not.toBeInTheDocument();
  });

  it("hides record when hide", () => {
    render(
      <Record record={{ ...mockRecord, show: false }} artist={mockArtist} />
    );
    expect(screen.queryByText("Album 1")).not.toBeInTheDocument();
  });
});

describe("renders editable record", () => {
  it("renders record with values", () => {
    render(<Record record={mockRecord} artist={mockArtist} editable />);
    screen.getByText("Album 1");
    screen.getByText("2001");
    screen.getByText("poor");
    screen.getByText("Artist 1");
    screen.getByTestId("edit");
  });

  it("renders fields when edit click", () => {
    render(<Record record={mockRecord} artist={mockArtist} editable />);
    fireEvent.click(screen.getByTestId("edit"));
    expect(screen.queryByTestId("edit")).not.toBeInTheDocument();
    screen.getByTestId("cancel");
    expect(screen.getByTestId("album-title").value).toBe("Album 1");
    expect(screen.getByLabelText("Year").value).toBe("2001");
    expect(screen.getByLabelText("Artist").value).toBe("Artist 1");
    expect(screen.getByLabelText("Condition").value).toBe("poor");
    screen.getByTestId("submit");
  });

  it("updates fields when edited and saves on save", () => {
    const saveRecord = jest.fn();
    const saveArtist = jest.fn();
    render(
      <Record
        record={mockRecord}
        artist={mockArtist}
        editable
        saveRecord={saveRecord}
        saveArtist={saveArtist}
      />
    );

    fireEvent.click(screen.getByTestId("edit"));
    fireEvent.change(screen.getByTestId("album-title"), {
      target: { value: "Album changed" },
    });
    fireEvent.change(screen.getByLabelText("Year"), {
      target: { value: "2000" },
    });
    fireEvent.change(screen.getByLabelText("Artist"), {
      target: { value: "Artist changed" },
    });
    fireEvent.change(screen.getByLabelText("Condition"), {
      target: { value: "condition_changed" },
    });

    expect(screen.getByTestId("album-title").value).toBe("Album changed");
    expect(screen.getByLabelText("Year").value).toBe("2000");
    expect(screen.getByLabelText("Artist").value).toBe("Artist changed");
    expect(screen.getByLabelText("Condition").value).toBe("condition_changed");

    fireEvent.click(screen.getByTestId("submit"));
    expect(saveRecord).toHaveBeenCalledTimes(1);
    expect(saveRecord).toHaveBeenCalledWith({
      album_title: "Album changed",
      artist: 0,
      condition: "condition_changed",
      id: 1,
      show: true,
      year: "2000",
    });
    expect(saveArtist).toHaveBeenCalledTimes(1);
    expect(saveArtist).toHaveBeenCalledWith({ name: "Artist changed", id: 0 });

    fireEvent.click(screen.getByTestId("edit"));
    fireEvent.change(screen.getByTestId("album-title"), {
      target: { value: "Album changed again" },
    });
    fireEvent.keyDown(screen.getByTestId("record-form"), {
      key: "Enter",
      code: "Enter",
      keyCode: 13,
      charCode: 13,
    });

    expect(saveArtist).toHaveBeenCalledTimes(2);
  });

  it("saves only record when only record edited", () => {
    const saveRecord = jest.fn();
    const saveArtist = jest.fn();
    render(
      <Record
        record={mockRecord}
        artist={mockArtist}
        editable
        saveRecord={saveRecord}
        saveArtist={saveArtist}
      />
    );

    fireEvent.click(screen.getByTestId("edit"));
    fireEvent.change(screen.getByTestId("album-title"), {
      target: { value: "Album changed" },
    });
    fireEvent.click(screen.getByTestId("submit"));
    expect(saveRecord).toHaveBeenCalledTimes(1);
    expect(saveArtist).toHaveBeenCalledTimes(0);
  });

  it("saves only artist when only artist edited", () => {
    const saveRecord = jest.fn();
    const saveArtist = jest.fn();
    render(
      <Record
        record={mockRecord}
        artist={mockArtist}
        editable
        saveRecord={saveRecord}
        saveArtist={saveArtist}
      />
    );

    fireEvent.click(screen.getByTestId("edit"));
    fireEvent.change(screen.getByLabelText("Artist"), {
      target: { value: "Artist changed" },
    });
    fireEvent.click(screen.getByTestId("submit"));
    expect(saveRecord).toHaveBeenCalledTimes(0);
    expect(saveArtist).toHaveBeenCalledTimes(1);
  });

  it("doesnt save when nothing changed", () => {
    const saveRecord = jest.fn();
    const saveArtist = jest.fn();
    render(
      <Record
        record={mockRecord}
        artist={mockArtist}
        editable
        saveRecord={saveRecord}
        saveArtist={saveArtist}
      />
    );

    fireEvent.click(screen.getByTestId("edit"));
    fireEvent.change(screen.getByTestId("album-title"), {
      target: { value: "Album 1" },
    });
    fireEvent.click(screen.getByTestId("submit"));
    expect(saveRecord).toHaveBeenCalledTimes(0);
    expect(saveArtist).toHaveBeenCalledTimes(0);
  });

  it("shows error and doesnt save on invalid input", () => {
    const saveRecord = jest.fn();
    const saveArtist = jest.fn();
    render(
      <Record
        record={mockRecord}
        artist={mockArtist}
        editable
        saveRecord={saveRecord}
        saveArtist={saveArtist}
      />
    );

    fireEvent.click(screen.getByTestId("edit"));
    fireEvent.change(screen.getByTestId("album-title"), {
      target: { value: "" },
    });
    fireEvent.click(screen.getByTestId("submit"));
    screen.getByText("Values can't be empty!");
    expect(saveRecord).toHaveBeenCalledTimes(0);
    expect(saveArtist).toHaveBeenCalledTimes(0);
    screen.getByTestId("submit");
  });

  it("cancel on cancel click or esc without saving", () => {
    const saveRecord = jest.fn();
    const saveArtist = jest.fn();
    render(
      <Record
        record={mockRecord}
        artist={mockArtist}
        editable
        saveRecord={saveRecord}
        saveArtist={saveArtist}
      />
    );

    fireEvent.click(screen.getByTestId("edit"));
    fireEvent.change(screen.getByTestId("album-title"), {
      target: { value: "Album changed" },
    });
    fireEvent.click(screen.getByTestId("cancel"));
    screen.getByText("Album 1");
    expect(saveRecord).toHaveBeenCalledTimes(0);
    expect(saveArtist).toHaveBeenCalledTimes(0);

    fireEvent.click(screen.getByTestId("edit"));
    expect(screen.getByTestId("album-title").value).toBe("Album 1");
    fireEvent.keyDown(screen.getByTestId("record-form"), {
      key: "Escape",
      code: "Escape",
      keyCode: 27,
      charCode: 27,
    });
    screen.getByTestId("edit");
  });

  it("enters edit mode when edit button focused and Enter click", () => {
    const saveRecord = jest.fn();
    const saveArtist = jest.fn();
    render(
      <Record
        record={mockRecord}
        artist={mockArtist}
        editable
        saveRecord={saveRecord}
        saveArtist={saveArtist}
      />
    );

    fireEvent.keyUp(screen.getByTestId("edit"), {
      key: "Enter",
      code: "Enter",
      keyCode: 13,
      charCode: 13,
    });
    screen.getByTestId("submit");
  });
});
