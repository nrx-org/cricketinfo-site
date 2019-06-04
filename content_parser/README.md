# Importing Content from Google Sheets

The `content_parser/` directory contains code that will parse CSV exports from Google Sheets, extract useful content
from them in the form of JSON files, and download all images embedded in the content. The CSV files must be in a
specific format, examples of which you will find in the `csv/` directory.

The CSV files that you want to import should always be placed in the `csv/` directory, and named in exactly in the same
way as the files that appear in that directory at the moment.

I don't recommend ever running this parser. We wrote this for an initial bulk import of data into our app, which it
handled pretty well. But we've made changes to our data since then. Running the parser will erase all those changes
and replace the existing data with whatever is in the sheets you add to the `csv/` directory. That may or may not be
a good thing. It'll also erase all the resized and optimized images with the full-size, highest-quality versions from
Wikimedia Commons.

If you still want to run the parser -- maybe you like playing with fire -- you can do so by following these steps:

1. Download CricketInfo content as CSV from Google Sheets. If you don't know which sheets I'm talking about, you
   shouldn't even be reading this.

2. There should be one CSV file for each entity (person, place, tournament, etc.) in each language. Rename each CSV
   file using the filenames currently in the `csv/` directory as guidelines.

3. Never run the full import at once. It takes too much time, and if the network connection dies in between then you're
   left with a broken set of files.

4. If the import fails the first time, try running it again. I don't know why it works the second time, I never said
   these scripts were robust. You probably shouldn't be running this anyway. It'll only end in tears.

5. Import each entity one by one. For example:

   `$ npm run import -- personalities`
   
   A list of entities you can import is available in `content_parser/index.js`.

6. Wait. Breathe. Hydrate. And hope that you haven't ruined everything. 
