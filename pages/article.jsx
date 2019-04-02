import React from "react";
import PropTypes from "prop-types";

import Head from "next/head";
// eslint-disable-next-line import/no-extraneous-dependencies
import fetch from "isomorphic-fetch";

import { BaseLayout } from "../components/BaseLayout";
import { ArticleContent } from "../components/ArticleContent";
import { makeTitle } from "../lib/make_title";
import { articleUrl } from "../lib/urls";
import {
  sectionsPropTypes,
  translationsPropTypes,
  imagePropTypes,
  factCardDataPropTypes
} from "../lib/prop_types";
import { LanguageSelector } from "../components/LanguageSelector";
import { LanguageContext } from "../language-context";
import { FactCard } from "../components/FactCard";

const Article = ({
  title,
  sections,
  lang,
  summary,
  coverImage,
  summaryFactCards,
  translations
}) => (
  <LanguageContext.Provider value={lang}>
    <BaseLayout>
      <Head>
        <title>{makeTitle(title, lang)}</title>
      </Head>
      <div className="wcp-article__cover-image-container">
        <img
          className="wcp-article__cover-image"
          src={coverImage.url}
          alt={coverImage.altText}
        />
      </div>
      <h1>{title}</h1>

      {/* eslint-disable-next-line react/no-danger */}
      <div dangerouslySetInnerHTML={{ __html: summary }} />

      <LanguageSelector translations={translations} coverImage={coverImage} />
      {summaryFactCards.map(f => (
        <FactCard className="wcp-summary-fact-card" cardData={f} />
      ))}
      <ArticleContent sections={sections} />
    </BaseLayout>
  </LanguageContext.Provider>
);

Article.getInitialProps = async ({ query }) => {
  const { articleId, lang } = query;
  const articleResponse = await fetch(articleUrl(articleId, lang));
  const articleJson = await articleResponse.json();

  return {
    ...articleJson,
    lang
  };
};

Article.defaultProps = {
  summaryFactCards: []
};

Article.propTypes = {
  title: PropTypes.string.isRequired,
  coverImage: imagePropTypes.isRequired,
  summary: PropTypes.string.isRequired,
  sections: sectionsPropTypes.isRequired,
  lang: PropTypes.string.isRequired,
  translations: translationsPropTypes.isRequired,
  summaryFactCards: PropTypes.arrayOf(factCardDataPropTypes)
};

export default Article;
