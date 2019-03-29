import React from "react";
import PropTypes from "prop-types";

import Head from "next/head";
// eslint-disable-next-line import/no-extraneous-dependencies
import fetch from "isomorphic-fetch";

import { BaseLayout } from "../components/BaseLayout";
import { ArticleContent } from "../components/ArticleContent";
import { makeTitle } from "../lib/make_title";
import { articleUrl } from "../lib/urls";
import { sectionsPropTypes, translationsPropTypes } from "../lib/prop_types";
import { LanguageSelector } from "../components/LanguageSelector";
import { LanguageContext } from "../language-context";

const Article = ({
  title,
  sections,
  lang,
  summary,
  coverImage,
  altText,
  translations
}) => (
  <LanguageContext.Provider value={lang}>
    <BaseLayout>
      <Head>
        <title>{makeTitle(title, lang)}</title>
      </Head>
      {coverImage ? (
        <div className="article__cover-image-container">
          <img
            className="article__cover-image"
            src={coverImage}
            alt={altText}
          />
        </div>
      ) : null}
      <h1>{title}</h1>
      {/* eslint-disable-next-line react/no-danger */}
      <div dangerouslySetInnerHTML={{ __html: summary }} />
      <LanguageSelector
        translations={translations}
        coverImage={coverImage}
        altText={altText}
      />
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

Article.defaultProps = { coverImage: null, altText: null };

Article.propTypes = {
  title: PropTypes.string.isRequired,
  coverImage: PropTypes.string,
  altText: PropTypes.string,
  summary: PropTypes.string.isRequired,
  sections: sectionsPropTypes.isRequired,
  lang: PropTypes.string.isRequired,
  translations: translationsPropTypes.isRequired
};

export default Article;
