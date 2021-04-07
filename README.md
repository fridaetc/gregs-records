# Gregs Record Collection


This project is a single page application that lists records fetched from Gregs [record collection](https://gist.githubusercontent.com/seanders/df38a92ffc4e8c56962e51b6e96e188f/raw/b032669142b7b57ede3496dffee5b7c16b8071e1/page1.json)

### Features
- Home page loads and displays record list (25 records) on page load, or an error message if failed. Error message have the option to reload the failed request again.
- Displays each record with following fields: Album title, Year, Artist & Condition.
- All fields on a record can be edited. If any of the fields are blank, an error message will show when clicking save. If the artist field is updated, all other records with the same artist id will be updated as well.
- To filter records there is a search field at the top of the page. This will search through all fields on the record and hide any records that doesn't include the search string (case insensitive). The search will only start once the user has stopped typing. Any records loaded or edited after filtering will also be filtered.
- To load more records there is a button at the bottom of the page. The button disappears when there are no more records to load.
- Extra: User can navigate and perform all actions through tabbing & Enter/Esc click.

**Limitations:**
- Any edits on a record will not be saved on the server which means after page reload all changes will be lost.


## Dev notes

The project is built in React. It was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).
- Icons comes from [react-icons](https://react-icons.github.io/react-icons/)
- Api requests are handled with [axios](https://github.com/axios/axios)
- All props passed to components are declared with [prop-types](https://github.com/facebook/prop-types)
- _In a dream world_ all components could be viewed in [storybook](https://storybook.js.org/docs/react/get-started/introduction) (they can't)

### Folder structure
- **api:** axios setup/interceptors and api requests. Files grouped by entity, for example records would hold all CRUD requests related to records.
- **components:** components that are shared and used often such as buttons.
- **pages:** folder for each navigable page (only records at the moment), which includes the pages components.

### API Record data format
``{
  results: [
    {
      album_title: "Album 1",
      year: 2001,
      condition: "poor",
      artist: { name: "Artist 1", id: 0 },
    }
  ],
  nextPage: "FULL_URL_TO_NEXT_PAGE",
}``

**Note:** For better referencing (by ids), data will be transformed to following format after load:
- Records: ``[
    {
      id: 1,
      album_title: "Album 1",
      year: 2001,
      condition: "poor",
      artist: 0,
    }
  ]
``
- Artists: ``[
{ name: "Artist 1", id: 0 }
  ]
``


## Available Scripts

To start the app make sure you got [node installed](https://www.npmjs.com/get-npm), then run:

### `npm i`
### `npm start`

This will run the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.


**In the project directory, you can also run:**

### `npm test`

Launches the test runner in the interactive watch mode.\
Tests are written in [React Testing Library](https://testing-library.com/docs/)

### `npm test -- --coverage`
See the test coverage of all files

### `npm run build`

Builds the app for production to the `build` folder.\

### `npm run prettier`

Will run and apply prettier formatting on all project files
