## Create the ID and URL mappers

1. Get a CSV of the sheet you want to parse. Make sure you parse the English language one first, and then everything else.
2. Open `make_id_and_url_mapper.js`
3. Set the `pathToParsedFile` variable to the path of the CSV file you want to parse
4. Ensure that the `currentLanguage` is the language of the csv you are looking to parse
5. Ensure that the names of the ID and Title columns in the id object (lines 45 - 49) are the same as the ones in the sheet
6. Run `node bin/make_id_and_url_mapper.js`
7. Repeat the same steps for the other two languages. Do not process until you have filled the mappers for all three langugages

# Create the JSON for the articles itself

1. Get a CSV of the sheet you want to parse. Make sure you parse the English language one first, and then everything else.
2. Open the relevant parser file.
3. Set the `pathToParsedFile` variable to the path of the CSV file you want to parse.
4. Ensure that the `currentLanguage` is the language of the csv you are looking to parse.
5. Get a csv file of the UI strings.
6. Set the path to the ui strings file.
7. Set the header to the UI Strings file (Refer lines 39 and 40 in `make_places_articles.js`)
8. Run `node bin/NAME_OF_THE_FILE.js`
9. Repeat the same steps for the other two languages.
