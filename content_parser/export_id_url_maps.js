const fs = require("fs");
const parse = require("csv-parse/lib/sync");

const { csvExports } = require("./exports_map");

const findEntryById = (idMap, id) => {
  return idMap.find(entry => entry.id === id);
};

const getSluggedTitle = str => str.replace(/\s+/g, "_").toLowerCase();

const createIdMappings = () => {
  const idMap = [];

  // Iterate over languages.
  Object.keys(csvExports).forEach(lang => {
    // Iterate over files available for each language.
    csvExports[lang].forEach(csvExport => {
      const fileContent = fs.readFileSync(
        csvExport.path,
        "utf8",
        (err, content) => {
          return content;
        }
      );

      const records = parse(fileContent, { columns: true, delimiter: "," });
      records.forEach(record => {
        let idMapEntry = findEntryById(idMap, record[csvExport.idFieldName]);

        if (!idMapEntry) {
          idMapEntry = {
            id: record[csvExport.idFieldName],
            title: {}
          };
          idMap.push(idMapEntry);
        }

        idMapEntry.title[lang] = record[csvExport.titleFieldName];
      });
    });
  });

  fs.writeFileSync(
    "./static/content/article_ids.json",
    JSON.stringify(idMap, null, 2)
  );
};

const createUrlMappings = () => {
  // This function assumes that createIdMappings has been run beforehand.
  // eslint-disable-next-line global-require
  const idMap = require("../static/content/article_ids.json");

  const urlMap = {};

  // Iterate over languages.
  Object.keys(csvExports).forEach(lang => {
    if (!urlMap[lang]) {
      urlMap[lang] = {};
    }

    // Iterate over files available for each language.
    csvExports[lang].forEach(csvExport => {
      const fileContent = fs.readFileSync(
        csvExport.path,
        "utf8",
        (err, content) => {
          return content;
        }
      );

      const records = parse(fileContent, { columns: true, delimiter: "," });
      records.forEach(record => {
        const id = record[csvExport.idFieldName];
        const englishTitle = findEntryById(idMap, id).title.en;
        const slug = getSluggedTitle(englishTitle);
        urlMap[lang][slug] = `/static/content/${lang}/${slug}.json`;
      });
    });
  });

  fs.writeFileSync(
    "./static/content/article_urls.json",
    JSON.stringify(urlMap, null, 2)
  );
};

module.exports.exportIdAndUrlMaps = () => {
  createIdMappings();
  createUrlMappings();
};
