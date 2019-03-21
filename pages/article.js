import React from "react";
import wtf from "wtf_wikipedia";

function Article({ title, content }) {
  return (
    <div>
      <h1>{ title }</h1>
      <div dangerouslySetInnerHTML={{ __html: content }}></div>
    </div>
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
