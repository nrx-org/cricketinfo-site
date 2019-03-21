import React from "react";

function Article({ articleId, lang }) {
  return (
    <div>
      <h1>{ articleId }</h1>
      <h1>{ lang }</h1>
    </div>
  );
}

Article.getInitialProps = async ({ query }) => {
  return {
    articleId: query.articleId,
    lang: query.lang
  };
};

export default Article;
