+ The various parsers in this file need to be run in a particular order to make everything work.
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
