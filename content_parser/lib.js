module.exports.findIdMapEntryById = (idMap, id) => {
  return idMap.find(entry => entry.id === id);
};

module.exports.findIdMapEntryByTitle = (idMap, title, lang) => {
  return idMap.find(
    entry => entry.title[lang].toLowerCase() === title.toLowerCase()
  );
};

module.exports.getSluggedTitle = str => str.replace(/\s+/g, "_").toLowerCase();

module.exports.makeArticleUrl = (lang, slug) => `/read/${lang}/${slug}`;

module.exports.makeContentUrl = (lang, slug) =>
  `/static/content/${lang}/${slug}.json`;

module.exports.getFileNameFromURL = url => {
  if (!url) return null;
  const filename = url.match(/File:(.*)/);
  if (filename) return filename[1];
  return null;
};
