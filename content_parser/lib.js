const fs = require("fs");
const url = require("url");
const parse = require("csv-parse/lib/sync");

const isUrlValid = u => url.parse(u).protocol !== null;

const findIdMapEntryById = (idMap, id) => {
  return idMap.find(entry => entry.id === id);
};

const getSluggedTitle = str => str.replace(/\s+/g, "_").toLowerCase();

const makeArticleUrl = (lang, slug) => `/read/${lang}/${slug}`;

const makeContentUrl = (lang, slug) => `/static/content/${lang}/${slug}.json`;

const findIdMapEntryByTitle = (idMap, title, lang) => {
  return idMap.find(
    entry => entry.title[lang].toLowerCase() === title.toLowerCase()
  );
};

const getCardInfoFromId = (idMap, id, lang) => {
  if (!id.trim()) {
    return null;
  }

  const referencedCardEntry = findIdMapEntryById(idMap, id);

  if (!referencedCardEntry) {
    return null;
  }

  const referencedCardSourceCsvFile = fs.readFileSync(
    referencedCardEntry.sourceCsvFile[lang],
    "utf8"
  );
  const records = parse(referencedCardSourceCsvFile, {
    columns: true,
    delimiter: ","
  });
  const record = records.find(r => r[referencedCardEntry.idFieldName] === id);

  if (!record) {
    return null;
  }

  return {
    title: record[referencedCardEntry.titleFieldName],
    summary: record[referencedCardEntry.descriptionFieldName],
    url: makeArticleUrl(lang, getSluggedTitle(referencedCardEntry.title.en)),
    contentUrl: makeContentUrl(
      lang,
      getSluggedTitle(referencedCardEntry.title.en)
    ),
    imageUrl: isUrlValid(record[referencedCardEntry.imageFieldName])
      ? record[referencedCardEntry.imageFieldName]
      : null
  };
};

module.exports = {
  findIdMapEntryById,
  findIdMapEntryByTitle,
  getSluggedTitle,
  makeArticleUrl,
  makeContentUrl,
  getCardInfoFromId
};
