module.exports.findIdMapEntryById = (idMap, id) => {
  return idMap.find(entry => entry.id === id);
};

module.exports.getSluggedTitle = str => str.replace(/\s+/g, "_").toLowerCase();

module.exports.makeArticleUrl = (lang, slug) => `/read/${lang}/${slug}`;

module.exports.makeContentUrl = (lang, slug) =>
  `/static/content/${lang}/${slug}.json`;
