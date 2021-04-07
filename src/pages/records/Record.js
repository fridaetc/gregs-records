import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { MdCreate, MdClear, MdSave } from "react-icons/md";
import styles from "./Record.module.css";

const Record = ({ record, artist = {}, editable, saveRecord, saveArtist }) => {
  const [editing, setEditing] = useState(false);
  const [currRecord, setCurrRecord] = useState(record);
  const [currArtist, setCurrArtist] = useState(artist);
  const [formError, setFormError] = useState(null);

  //Update record state if record was updated from parent
  useEffect(() => {
    setCurrRecord(record);
  }, [record]);

  //Update artist state if artist was updated from parent
  useEffect(() => {
    setCurrArtist(artist);
  }, [artist]);

  //Set new record value when editing a record field
  const fieldChange = (e) => {
    const { name, value } = e.target;

    //Year should be a number
    if (name === "year" && typeof value === "number") parseInt(value);

    setCurrRecord((prevRecord) => ({
      ...prevRecord,
      [name]: value,
    }));
  };

  //Set new artist value when editing artist
  const artistChange = (e) => {
    const value = e.target.value;
    setCurrArtist((prevArtist) => {
      return {
        ...prevArtist,
        name: value,
      }
    });
  };

  //Find any empty values in object
  const isValid = (obj) => {
    //TODO: better validation (length, number, max etc)
    for (let key in obj) {
      if (obj[key] === "") {
        return false;
      }
    }
    return true;
  };

  //Stop editing and save the change
  const saveData = (e) => {
    if (e) e.preventDefault();
    setFormError(null);

    const recordChanged = currRecord !== record;
    const artistChanged = currArtist !== artist;

    if (recordChanged || artistChanged) {
      //Validate no values are empty before saving
      if (isValid(currRecord) && isValid(currArtist)) {
        if (recordChanged) saveRecord(currRecord);
        if (artistChanged) saveArtist(currArtist);
        setEditing(false);
      } else {
        setFormError("Values can't be empty!");
      }
    } else {
      setEditing(false);
    }
  };

  //Stop editing and discard changes
  const cancelEditRecord = () => {
    setEditing(false);
    setFormError(null);
    setCurrRecord(record);
    setCurrArtist(artist);
  };

  //Cancel edit if esc click when form focused
  const handleFormKeyDown = (e) => {
    if ((e.keyCode || e.which) === 27) cancelEditRecord();
    if ((e.keyCode || e.which) === 13) saveData();
  };

  //Start edit if enter click when edit btn focused
  const handleEditBtnKeyUp = (e) => {
    if ((e.keyCode || e.which) === 13) setEditing(true);
  };

  const recordList = (
    <article className={styles.record} data-testid="record">
      <h3 className={styles.title}>{record.album_title}</h3>
      <table className={styles.info}>
        <tbody>
          <tr>
            <td className={styles.infoTitle}>Year</td>
            <td className={styles.infoText}>
              <time dateTime={record.year}>{record.year}</time>
            </td>
          </tr>
          <tr>
            <td className={styles.infoTitle}>Artist</td>
            <td className={styles.infoText}>{artist.name}</td>
          </tr>
          <tr>
            <td className={styles.infoTitle}>Condition</td>
            <td className={styles.infoText}>{record.condition}</td>
          </tr>
        </tbody>
      </table>
      <div className={styles.actions}>
        {editable && (
          <MdCreate
            data-testid="edit"
            tabIndex="0"
            role="button"
            className={styles.actionBtn}
            onKeyUp={handleEditBtnKeyUp}
            onClick={() => setEditing(true)}
            size="1.5em"
          />
        )}
      </div>
    </article>
  );

  const recordForm = (
    <form
      tabIndex="0"
      onKeyDown={handleFormKeyDown}
      onSubmit={saveData}
      className={styles.record}
      data-testid="record-form"
    >
      <MdClear
        data-testid="cancel"
        className={styles.cancel}
        onClick={cancelEditRecord}
        size="1.5em"
      />
      <input
        data-testid="album-title"
        className={styles.titleInput}
        onChange={fieldChange}
        autoFocus
        type="text"
        name="album_title"
        id="album_title"
        placeholder="Album title"
        value={currRecord.album_title}
      />
      <table className={styles.info}>
        <tbody>
          <tr>
            <td>
              <label htmlFor="year" className={styles.infoTitle}>
                Year
              </label>
            </td>
            <td>
              <input
                onChange={fieldChange}
                type="number"
                name="year"
                id="year"
                value={currRecord.year}
              />
            </td>
          </tr>
          <tr>
            <td>
              <label htmlFor="artist" className={styles.infoTitle}>
                Artist
              </label>
            </td>
            <td>
              <input
                onChange={artistChange}
                type="text"
                name="artist"
                id="artist"
                value={currArtist.name}
              />
            </td>
          </tr>
          <tr>
            <td className={styles.infoTitle}>
              <label htmlFor="condition" className={styles.infoTitle}>
                Condition
              </label>
            </td>
            <td>
              <input
                onChange={fieldChange}
                type="text"
                name="condition"
                id="condition"
                value={currRecord.condition}
              />
            </td>
          </tr>
        </tbody>
      </table>
      <div className={styles.actions}>
        {formError && <span>{formError}</span>}
        <button data-testid="submit" className={styles.actionBtn} type="submit">
          <MdSave size="1.5em" />
        </button>
      </div>
    </form>
  );

  return record.show ? editing ? recordForm : recordList : <></>;
};

Record.propTypes = {
  record: PropTypes.object.isRequired,
  artist: PropTypes.object,
  editable: PropTypes.bool,
  saveRecord: PropTypes.func,
  saveArtist: PropTypes.func,
};

export default React.memo(Record);
