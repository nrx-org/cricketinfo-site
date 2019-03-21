import React from "react";
import Head from "next/head";
import wtf from "wtf_wikipedia";

import BaseLayout from "../components/BaseLayout";
import { makeTitle } from "../lib/make_title";

function Article({ title, content, lang }) {
  return (
    <BaseLayout>
      <Head>
        <title>{ makeTitle(title, lang) }</title>
      </Head>
      <h1>{ title }</h1>
      <div dangerouslySetInnerHTML={{ __html: content }} />
    </BaseLayout>
  );
}

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

export default Article;
