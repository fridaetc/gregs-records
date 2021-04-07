import React, { useEffect, useCallback, useState, useRef } from "react";
import { getRecords } from "api/records";
import Loader from "components/Loader";
import Button from "components/Button";
import Notification from "components/Notification";
import SearchInput from "components/SearchInput";
import Record from "./Record";
import styles from "./Records.module.css";

const Records = () => {
  const nextPage = useRef(
      "https://gist.githubusercontent.com/seanders/df38a92ffc4e8c56962e51b6e96e188f/raw/b032669142b7b57ede3496dffee5b7c16b8071e1/page1.json"
    ),
    [loading, setLoading] = useState(true),
    [error, setError] = useState(false),
    [records, setRecords] = useState([]),
    [artists, setArtists] = useState([]),
    searchQuery = useRef(""),
    [searchLoading, setSearchLoading] = useState(false);

  //Filter record based on search query
  const filterRecord = useCallback((recordToFilter, artistToFilter) => {
    //Get all values from record and artist
    const allValues = Object.values(recordToFilter).concat(
      Object.values(artistToFilter)
    );

    //Check if record or artist includes searched value
    const show = allValues.some((value) =>
      value.toString().toLowerCase().includes(searchQuery.current)
    );

    //If record doesnt need showing/hiding, return previous value to avoid rerender
    return recordToFilter.show === show
      ? recordToFilter
      : {
          ...recordToFilter,
          show,
        };
  }, []);

  //Add unique id and artist id to records to have something to reference instead of whole objects
  const convertRecords = useCallback(
    (recordsToConvert, startId) => {
      return recordsToConvert.map((record, i) => {
        const newRecord = {
          ...record,
          artist: record.artist.id,
          id: startId + i,
          show: true,
        };

        //Add any filtering
        return searchQuery.current
          ? filterRecord(newRecord, record.artist)
          : newRecord;
      });
    },
    [filterRecord]
  );

  //Return all the new artists based on id
  const getNewArtists = (prevArtists, artistsToAdd) => {
    const newArtists = [];
    artistsToAdd.forEach((artistToAdd, i) => {
      if (
        !~prevArtists.findIndex(
          (prevArtist) => prevArtist.id === artistToAdd.id
        ) &&
        !~newArtists.findIndex((newArtist) => newArtist.id === artistToAdd.id)
      ) {
        newArtists.push(artistToAdd);
      }
    });

    return newArtists;
  };

  //Load records from api and append to state or handle errors
  const loadNextRecords = useCallback(() => {
    setLoading(true);
    setError(false);

    getRecords(nextPage.current)
      .then((res) => {
        setRecords((prevRecords) => {
          const startId = prevRecords.length
            ? prevRecords[prevRecords.length - 1].id + 1
            : 1;
          return prevRecords.concat(convertRecords(res.results, startId));
        });

        setArtists((prevArtists) => {
          return [
            ...prevArtists,
            ...getNewArtists(
              prevArtists,
              res.results.map((record) => record.artist)
            ),
          ];
        });

        nextPage.current = res.nextPage;
      })
      .catch((err) => {
        setError("Couldn't load records!");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [convertRecords]);

  //Get records on first load
  useEffect(() => {
    loadNextRecords();
  }, [loadNextRecords]);

  //Update the record list with an edited record
  const updateRecord = useCallback(
    (editedRecord) => {
      setRecords((prevRecords) => {
        //Find the record and apply any current filtering
        return prevRecords.map((prevRecord) =>
          prevRecord.id === editedRecord.id
            ? searchQuery.current
              ? filterRecord(editedRecord, {})
              : editedRecord
            : prevRecord
        );
      });
    },
    [filterRecord]
  );

  //Update the artist list with an edited artist
  const updateArtist = useCallback(
    (editedArtist) => {
      const editedArtists = artists.map((prevArtist) =>
        prevArtist.id === editedArtist.id ? editedArtist : prevArtist
      );

      setArtists(editedArtists);

      //Apply any current filtering
      if (searchQuery.current) {
        setRecords((prevRecords) => {
          return prevRecords.map((prevRecord) =>
            filterRecord(
              prevRecord,
              editedArtists.find((artist) => artist.id === prevRecord.artist)
            )
          );
        });
      }
    },
    [filterRecord, artists]
  );

  //Save query and filter when search debounce finished
  const handleSearched = useCallback(
    (query) => {
      searchQuery.current = query.trim().toLowerCase();
      setRecords((prevRecords) =>
        prevRecords.map((prevRecord) =>
          filterRecord(
            prevRecord,
            artists.find((artist) => prevRecord.artist === artist.id)
          )
        )
      );
      setSearchLoading(false);
    },
    [filterRecord, artists]
  );

  const startSearchLoading = useCallback(() => setSearchLoading(true), []);

  const getArtist = useCallback(
    (id) => {
      return artists.find((artist) => artist.id === id);
    },
    [artists]
  );

  return (
    <section className={styles.records}>
      {records.length > 0 && (
        <SearchInput
          loading={searchLoading}
          onSearchStart={startSearchLoading}
          onDebouncedSearch={handleSearched}
        />
      )}
      <div className={styles.recordList}>
        {records.length > 0 &&
          records.map((record) => (
            <Record
              key={record.id}
              record={record}
              artist={getArtist(record.artist)}
              saveRecord={updateRecord}
              saveArtist={updateArtist}
              editable
            />
          ))}
      </div>
      {loading && !records.length && <Loader />}
      {nextPage.current && records.length > 0 && (
        <Button value="Show More" loading={loading} onClick={loadNextRecords} />
      )}
      {error && (
        <Notification
          text={error}
          action={{ text: "Reload", onClick: loadNextRecords }}
          type="error"
        />
      )}
    </section>
  );
};

export default React.memo(Records);
