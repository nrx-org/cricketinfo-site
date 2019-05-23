<!-- + The various parsers in this file need to be run in a particular order to make everything work.
+ The English articles are the base of everything, hence the english articles should be run first, for every type. 
+ This will also create the ID table.
+ It is important to create the ID table first with the english articles because the titles of the english articles are also used to create 
    + the path for the images
    + the path for the src of the images
    + alt text
    + URLs
+ Once you are done running the English articles, 
    + uncomment the second getSluggedTitle() to allow the english version to be used in places where paths are involved
    + comment out the lines of getImageForFile that actually fetch the images, because we do not want to pull the same images more than once.
    + change the paths of the written files to the appropriate directory in static
    + uncomment the appropriate paths of the ID mappers -->


1. Get a CSV of the sheet you want to parse
2. Open make_id_..FILL_THIS_UP
3. Set the pathToParsedFile variable to the path of the CSV file you want to parse
3. Ensure that the currentLanguage is the language of the csv you are looking to parse 
4. Ensure that the names of the ID and Title columns in the id object (lines FILL_THIS_UP) are the same as the ones in the sheet 
5. Run `node bin/make_id_FILL_THIS_UP`
6. Next, open the make_X.js file of the relevant category of the sheet 
7. See 3 and 3
8. Run see 5

voila

