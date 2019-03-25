import React from "react";
import PropTypes from "prop-types";

import Head from "next/head";
import wtf from "wtf_wikipedia";

import { BaseLayout } from "../components/BaseLayout";
import { makeTitle } from "../lib/make_title";

const Article = ({ title, content, lang, summary }) => (
  <BaseLayout lang={lang}>
    <Head>
      <title>{makeTitle(title, lang)}</title>
    </Head>
    <h1>{title}</h1>
    {/* eslint-disable-next-line react/no-danger */}
    <div dangerouslySetInnerHTML={{ __html: summary }} />
    {/* eslint-disable-next-line react/no-danger */}
    <div dangerouslySetInnerHTML={{ __html: content }} />
  </BaseLayout>
);

Article.getInitialProps = async ({ query }) => {
  const { articleId, lang } = query;
  const article = await wtf.fetch(articleId, lang);
  const summary = article.sections()[0].html();
  const content = article
    .sections()
    .slice(1)
    .reduce((contentString, section) => {
      return contentString + section.html();
    }, "");

  return {
    articleId,
    lang,
    content,
    summary,
    title: article.title()
  };
};

Article.propTypes = {
  title: PropTypes.string.isRequired,
  content: PropTypes.string.isRequired,
  lang: PropTypes.string.isRequired,
  summary: PropTypes.string.isRequired
};

export default Article;
