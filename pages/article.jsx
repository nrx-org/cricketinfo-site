import React from "react";
import PropTypes from "prop-types";

import Head from "next/head";
import wtf from "wtf_wikipedia";

import { BaseLayout } from "../components/BaseLayout";
import { makeTitle } from "../lib/make_title";

const Article = ({ title, content, lang }) => (
  <BaseLayout lang={lang}>
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
  const article = await wtf.fetch(articleId, lang);

  return {
    articleId,
    lang,
    content: article.html(),
    title: article.title()
  };
};

Article.propTypes = {
  title: PropTypes.string.isRequired,
  content: PropTypes.string.isRequired,
  lang: PropTypes.string.isRequired
};

export default Article;
