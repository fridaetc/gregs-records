import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import MockAdapter from "axios-mock-adapter";
import api from "api/api";
import Records from "../Records";

const mockApi = new MockAdapter(api);
const firstPageUrl =
  "https://gist.githubusercontent.com/seanders/df38a92ffc4e8c56962e51b6e96e188f/raw/b032669142b7b57ede3496dffee5b7c16b8071e1/page1.json";
const mockData = {
  results: [
    {
      album_title: "Album 1",
      year: 2001,
      condition: "poor",
      artist: { name: "Artist 1", id: 0 },
    },
    {
      album_title: "Album 2",
      year: 2002,
      condition: "very_good",
      artist: { name: "Artist 2", id: 1 },
    },
  ],
  nextPage: "/page2",
};
const mockData2 = {
  results: [
    {
      album_title: "Album 3",
      year: 2003,
      condition: "mint",
      artist: { name: "Artist 1", id: 0 },
    },
    {
      album_title: "Album 4",
      year: 2004,
      condition: "poor",
      artist: { name: "Artist 2", id: 1 },
    },
    {
      album_title: "Album 5",
      year: 2005,
      condition: "horrible",
      artist: { name: "Artist 2", id: 1 },
    },
  ],
  nextPage: null,
};

describe("handles fetching records", () => {
  afterEach(() => {
    mockApi.reset();
  });

  it("renders records on success", async () => {
    mockApi.onGet(firstPageUrl).reply(200, mockData);
    render(<Records />);

    screen.getByTestId("loader");

    const records = await screen.findAllByTestId("record");
    expect(records).toHaveLength(2);
    expect(records[0].textContent).toBe(
      "Album 1Year2001ArtistArtist 1Conditionpoor"
    );
    expect(records[1].textContent).toBe(
      "Album 2Year2002ArtistArtist 2Conditionvery_good"
    );
  });

  it("renders more records on show more button click", async () => {
    mockApi
      .onGet(firstPageUrl)
      .reply(200, mockData)
      .onGet("/page2")
      .reply(200, mockData2);
    render(<Records />);

    screen.getByTestId("loader");
    expect(screen.queryByText("Show More")).not.toBeInTheDocument();

    await screen.findAllByTestId("record");

    fireEvent.click(screen.getByText("Show More"));
    screen.getByText("Show More...");

    await screen.findByText("Album 3");
    expect(screen.queryByText("Show More")).not.toBeInTheDocument();
    const records = screen.getAllByTestId("record");
    expect(records).toHaveLength(5);
    expect(records[0].textContent).toBe(
      "Album 1Year2001ArtistArtist 1Conditionpoor"
    );
    expect(records[1].textContent).toBe(
      "Album 2Year2002ArtistArtist 2Conditionvery_good"
    );
    expect(records[2].textContent).toBe(
      "Album 3Year2003ArtistArtist 1Conditionmint"
    );
    expect(records[3].textContent).toBe(
      "Album 4Year2004ArtistArtist 2Conditionpoor"
    );
    expect(records[4].textContent).toBe(
      "Album 5Year2005ArtistArtist 2Conditionhorrible"
    );
  });

  it("renders message on error", async () => {
    mockApi.onGet(firstPageUrl).reply(500);
    render(<Records />);

    screen.getByTestId("loader");

    await screen.findByText("Couldn't load records!");
    const records = screen.queryAllByTestId("record");
    expect(records).toHaveLength(0);
  });

  it("reloads data on error message reload click", async () => {
    mockApi.onGet(firstPageUrl).reply(500);
    render(<Records />);

    screen.getByTestId("loader");

    const reloadBtn = await screen.findByTitle("Reload");
    mockApi.onGet(firstPageUrl).reply(200, mockData);
    fireEvent.click(reloadBtn);

    screen.getByTestId("loader");
    expect(screen.queryByTitle("Reload")).not.toBeInTheDocument();

    const records = await screen.findAllByTestId("record");
    expect(records).toHaveLength(2);
    expect(records[0].textContent).toBe(
      "Album 1Year2001ArtistArtist 1Conditionpoor"
    );
    expect(records[1].textContent).toBe(
      "Album 2Year2002ArtistArtist 2Conditionvery_good"
    );
  });
});

describe("handles editing records", () => {
  afterEach(() => {
    mockApi.reset();
  });

  it("edits record and keeps changes after load more", async () => {
    mockApi
      .onGet(firstPageUrl)
      .reply(200, mockData)
      .onGet("/page2")
      .reply(200, mockData2);
    render(<Records />);

    const records = await screen.findAllByTestId("record");
    fireEvent.click(screen.getAllByTestId("edit")[1]);
    fireEvent.change(screen.getByTestId("album-title"), {
      target: { value: "Album changed" },
    });
    fireEvent.change(screen.getByLabelText("Artist"), {
      target: { value: "Artist changed" },
    });
    fireEvent.click(screen.getByTestId("submit"));

    expect(screen.getAllByTestId("edit")).toHaveLength(2);
    const recordsUpdated = await screen.findAllByTestId("record");
    expect(recordsUpdated[0].textContent).toBe(
      "Album 1Year2001ArtistArtist 1Conditionpoor"
    );
    expect(recordsUpdated[1].textContent).toBe(
      "Album changedYear2002ArtistArtist changedConditionvery_good"
    );

    fireEvent.click(screen.getByText("Show More"));

    await screen.findByText("Album 3");
    const recordsUpdated2 = screen.getAllByTestId("record");
    expect(recordsUpdated2[2].textContent).toBe(
      "Album 3Year2003ArtistArtist 1Conditionmint"
    );
    expect(recordsUpdated2[3].textContent).toBe(
      "Album 4Year2004ArtistArtist changedConditionpoor"
    );
    expect(recordsUpdated2[4].textContent).toBe(
      "Album 5Year2005ArtistArtist changedConditionhorrible"
    );
  });
  });

  describe("handles filtering records", () => {
    afterEach(() => {
      mockApi.reset();
    });

  it("filters records and keeps filter after load more or edit", async () => {
    mockApi
      .onGet(firstPageUrl)
      .reply(200, mockData)
      .onGet("/page2")
      .reply(200, mockData2);
    render(<Records />);

    const records = await screen.findAllByTestId("record");
    const input = screen.getByTestId("search-input");

    //Filter
    fireEvent.change(input, {
      target: { value: "Album 2" },
    });
    screen.getByTestId("loader");
    await waitFor(() => expect(screen.queryByTestId("loader")).not.toBeInTheDocument());
    const recordsUpdated = await screen.findAllByTestId("record");
    expect(recordsUpdated.length).toBe(1);
    expect(recordsUpdated[0].textContent).toBe(
      "Album 2Year2002ArtistArtist 2Conditionvery_good"
    );

    //Edit record
    fireEvent.click(screen.getAllByTestId("edit")[0]);
    fireEvent.change(screen.getByTestId("album-title"), {
      target: { value: "Album changed" },
    });
    fireEvent.click(screen.getByTestId("submit"));
    await waitFor(() => expect(screen.queryByTestId("record")).not.toBeInTheDocument());

    //Load more
    fireEvent.click(screen.getByText("Show More"));
    await waitFor(() => expect(screen.queryByTestId("record")).not.toBeInTheDocument());

  });

  it("filters artists after edit and load more", async () => {
    mockApi
      .onGet(firstPageUrl)
      .reply(200, mockData)
      .onGet("/page2")
      .reply(200, mockData2);
    render(<Records />);

    const records = await screen.findAllByTestId("record");
    const input = screen.getByTestId("search-input");

    //Filter
    fireEvent.change(input, {
      target: { value: "Artist 2" },
    });
    screen.getByTestId("loader");
    await waitFor(() => expect(screen.queryByTestId("loader")).not.toBeInTheDocument());
    const recordsUpdated = await screen.findAllByTestId("record");
    expect(recordsUpdated.length).toBe(1);
    expect(recordsUpdated[0].textContent).toBe(
      "Album 2Year2002ArtistArtist 2Conditionvery_good"
    );

    //Edit record
    fireEvent.click(screen.getAllByTestId("edit")[0]);
    fireEvent.change(screen.getByLabelText("Artist"), {
      target: { value: "Artist changed" },
    });
    fireEvent.click(screen.getByTestId("submit"));
    await waitFor(() => expect(screen.queryByTestId("record")).not.toBeInTheDocument());

    //Load more
    fireEvent.click(screen.getByText("Show More"));
    await waitFor(() => expect(screen.queryByTestId("record")).not.toBeInTheDocument());
  });
});
