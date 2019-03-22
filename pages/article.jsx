import React from "react";
import PropTypes from "prop-types";

import fetch from "isomorphic-fetch";
import utf8 from "utf8";
import cheerio from "cheerio";

import Head from "next/head";

import { BaseLayout } from "../components/BaseLayout";
import { makeTitle } from "../lib/make_title";

const Article = ({ title, content, lang }) => (
  <BaseLayout>
    <Head>
      <title>{makeTitle(title, lang)}</title>
    </Head>
    <h1>{title}</h1>
    {/* eslint-disable-next-line react/no-danger */}
    <div dangerouslySetInnerHTML={{ __html: content }} />
  </BaseLayout>
);

Article.getInitialProps = async ({ query }) => {
  const { articleId, lang } = query;
  const wikiUrl = utf8.encode(
    `https://${lang}.wikipedia.org/api/rest_v1/page/mobile-sections/${articleId}`
  );
  const articleResponse = await fetch(wikiUrl);
  const article = await articleResponse.json();

  let content = article.remaining.sections.reduce((accContent, current) => {
    const level = current.toclevel + 1;
    const sectionTitle = `<h${level}>${current.line}</h${level}>`;
    return accContent + sectionTitle + current.text;
  }, article.lead.sections[0].text);

  const $ = cheerio.load(content);
  $(".infobox").remove();
  content = $.html();
  return {
    articleId,
    lang,
    content,
    title: article.lead.displaytitle
  };
};

Article.propTypes = {
  title: PropTypes.string.isRequired,
  content: PropTypes.string.isRequired,
  lang: PropTypes.string.isRequired
};

export default Article;
