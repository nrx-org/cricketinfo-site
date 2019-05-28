const fs = require("fs");
const url = require("url");
const parse = require("csv-parse/lib/sync");
const fetch = require("isomorphic-fetch");
const cheerio = require("cheerio");
const unescape = require("unescape");

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

const getFileNameFromURL = url => {
  if (!url) return null;
  const filename = url.match(/File:(.*)/);
  if (filename) return filename[1];
  return null;
};

const getCardInfoFromId = (idMap, id, lang) => {
  if (!id || !id.trim()) {
    return null;
  }

  const referencedCardEntry = findIdMapEntryById(idMap, id);

  if (!referencedCardEntry) {
    return null;
  }

  let referencedCardSourceCsvFile;

  try {
    referencedCardSourceCsvFile = fs.readFileSync(
      referencedCardEntry.sourceCsvFile[lang],
      "utf8"
    );
  } catch (e) {
    /* eslint-disable no-console */
    console.log(
      `ERROR: Could not open CSV file for ID ${id} and language ${lang}. File path was ${
        referencedCardEntry.sourceCsvFile[lang]
      }.`
    );
    /* eslint-enable no-console */

    return null;
  }

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

const makeImageDirectoryPath = articleSlug => `./static/images/${articleSlug}`;

const makeImagePath = (imageFileName, articleSlug) =>
  `./static/images/${articleSlug}/${imageFileName}`;

const makeServerSideImageUrl = (imageFileName, articleSlug) =>
  `/static/images/${articleSlug}/${imageFileName}`;

const downloadImageAndFillAttributions = async (imageObject, articleSlug) => {
  // Operate on a copy.
  const localImageObject = {
    ...imageObject
  };

  if (!localImageObject.url || !isUrlValid(localImageObject.url)) {
    return localImageObject;
  }

  const imageDirectory = makeImageDirectoryPath(articleSlug);
  if (!fs.existsSync(imageDirectory)) {
    fs.mkdirSync(imageDirectory);
  }

  // If it's a link to a Wikipedia section, we need to rewrite the url and
  // point it to the image details page.
  const parsedUrl = url.parse(localImageObject.url);
  const mediaPrefix = "#/media/File:";
  if (
    parsedUrl.hostname === "en.wikipedia.org" &&
    parsedUrl.hash &&
    parsedUrl.hash.startsWith(mediaPrefix)
  ) {
    const wikipediaFileName = parsedUrl.hash.replace(mediaPrefix, "");
    localImageObject.url = `https://en.wikipedia.org/wiki/File:${wikipediaFileName}`;
  }

  // Download linked image.
  let imageFileName = url
    .parse(localImageObject.url)
    .pathname.split("/")
    .slice(-1)[0];

  if (imageFileName.match(/File:/)) {
    imageFileName = imageFileName.replace("File:", "");
  }

  imageFileName = unescape(imageFileName);

  let imageResponse;
  try {
    imageResponse = await fetch(localImageObject.url);
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log(
      `ERROR: Could not download image with URL "${
        localImageObject.url
      }". Failed to fetch.`
    );
    return null;
  }

  const responseHeader = imageResponse.headers.get("Content-Type");

  // If it's a direct download, save the image with the correct name in the
  // directory.
  if (responseHeader.match(/image\//)) {
    const imageFile = fs.createWriteStream(
      makeImagePath(imageFileName, articleSlug)
    );
    imageResponse.body.pipe(imageFile);
    return {
      ...localImageObject,
      url: makeServerSideImageUrl(imageFileName, articleSlug)
    };
  }

  // If it's a Commons logo, download the original file.
  // If it's a Wikipedia logo (same page structure as Commons), download the
  // original file.
  if (imageResponse.headers.get("Content-Type").match(/text\/html/)) {
    const html = await imageResponse.text();
    const $ = cheerio.load(html);
    const imageUrl = $(".fullMedia > p > a").attr("href");
    let licenseText = "";
    $(".licensetpl td:nth-child(2)").each((index, element) => {
      licenseText = `${licenseText}<p>${$(element)
        .html()
        .trim()}</p>`;
    });

    if (!imageUrl) {
      // eslint-disable-next-line no-console
      console.log(
        `ERROR: Could not download image with URL ${
          localImageObject.url
        }. The link is neither a Wikimedia Commons page, nor a direct image link.`
      );
    }

    return downloadImageAndFillAttributions(
      {
        ...localImageObject,
        url: imageUrl,
        license: licenseText
      },
      articleSlug
    );
  }

  // If it's anything else, log the error.
  // eslint-disable-next-line no-console
  console.log(
    `ERROR: Could not download image with URL ${
      localImageObject.url
    }, unknown response header`
  );

  return null;
};

module.exports = {
  findIdMapEntryById,
  findIdMapEntryByTitle,
  getSluggedTitle,
  makeArticleUrl,
  makeContentUrl,
  getCardInfoFromId,
  getFileNameFromURL,
  downloadImageAndFillAttributions
};