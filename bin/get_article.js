/* eslint-disable import/no-extraneous-dependencies */
const fetch = require("isomorphic-fetch");
const utf8 = require("utf8");
const cheerio = require("cheerio");
/* eslint-enable import/no-extraneous-dependencies */

const SECTION_TITLES = {
  en: {
    externalLinks: "External links",
    seeAlso: "See also",
    references: "References"
  },
  hi: {
    externalLinks: "बाहरी कड़ियाँ",
    seeAlso: "इन्हें भी देखें",
    references: "सन्दर्भ"
  }
};

function stripSelectors(html, selectorsList) {
  const $ = cheerio.load(html, { decodeEntities: false });
  selectorsList.forEach(s => $(s).remove());
  return $("body").html();
}

function stripCommonElements(html) {
  return stripSelectors(html, [
    ".infobox",
    ".mw-ref",
    ".reference",
    ".reflist",
    ".mbox-small",
    "figure"
  ]);
}

function filterCommonSections(sections, lang) {
  return sections.filter(
    s => !Object.values(SECTION_TITLES[lang]).includes(s.line)
  );
}

async function getArticle(articleId, lang) {
  const url = utf8.encode(
    `https://${lang}.wikipedia.org/api/rest_v1/page/mobile-sections/${articleId}`
  );
  const articleResponse = await fetch(url);
  const articleJson = await articleResponse.json();

  const sanitizedArticle = {
    title: articleJson.lead.displaytitle,
    coverImage: "{{ TODO }}"
  };

  // Get summary (i.e the first section). Remove infobox.
  sanitizedArticle.summary = stripCommonElements(
    articleJson.lead.sections[0].text
  );

  // Get the remaining sections. Remove infoboxes and images if they exist.
  sanitizedArticle.sections = filterCommonSections(
    articleJson.remaining.sections,
    lang
  ).map(section => ({
    title: section.line,
    anchor: section.anchor,
    content: stripCommonElements(section.text),
    tocLevel: section.toclevel + 1
  }));

  console.log(JSON.stringify(sanitizedArticle));
}

// getArticle("मंगलयान", "hi");
getArticle("Mangalyaan", "en");
