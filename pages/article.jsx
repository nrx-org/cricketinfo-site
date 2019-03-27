import React from "react";
import PropTypes from "prop-types";

import Head from "next/head";
import fetch from "isomorphic-fetch";

import { BaseLayout } from "../components/BaseLayout";
import { ArticleContent } from "../components/ArticleContent";
import { makeTitle } from "../lib/make_title";
import { articleUrl } from "../lib/urls";
import { sectionsPropTypes } from "../lib/prop_types";

const Article = ({ title, sections, lang, summary, coverImage }) => (
  <BaseLayout lang={lang}>
    <Head>
      <title>{makeTitle(title, lang)}</title>
    </Head>
    {coverImage ? (
      <div className="article__cover-image-container">
        <img className="article__cover-image" src={coverImage} alt="Cover" />
      </div>
    ) : null}
    <h1>{title}</h1>
    {/* eslint-disable-next-line react/no-danger */}
    <div dangerouslySetInnerHTML={{ __html: summary }} />
    <ArticleContent sections={sections} />
  </BaseLayout>
);

Article.getInitialProps = async ({ query }) => {
  const { articleId, lang } = query;
  const articleResponse = await fetch(articleUrl(articleId, lang));
  const articleJson = await articleResponse.json();

  return articleJson;
};

Article.defaultProps = { coverImage: null };

Article.propTypes = {
  title: PropTypes.string.isRequired,
  coverImage: PropTypes.string,
  summary: PropTypes.string.isRequired,
  sections: sectionsPropTypes.isRequired,
  lang: PropTypes.string.isRequired
};

export default Article;
