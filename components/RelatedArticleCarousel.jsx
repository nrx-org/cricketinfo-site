import React from "react";

import { Card } from "./Card";

const RELATED_ARTICLES = [
  {
    label: "Himalayas",
    value: "www.nsvp.in",
    img: {
      url: "https://placekitten.com/64/64",
      altText: "thinsg  go here"
    }
  },
  {
    label: "Vrindavan",
    value: "www.nsvp.in",
    img: {
      url: "https://placekitten.com/64/64",
      altText: "more thinsg go here"
    }
  },
  {
    label: "Vrindavan",
    value: "www.nsvp.in",
    img: {
      url: "https://placekitten.com/64/64",
      altText: "more thinsg go here"
    }
  }
];

export const RelatedArticleCarousel = () => {
  return (
    <div className="wcp-related-article-carousel">
      {RELATED_ARTICLES.map(a => (
        <Card
          shadowSize="s"
          title={a.label}
          titleClassName="wcp-related-article-carousel__title"
          coverImage={a.img}
          className="wcp-related-article-carousel__item"
          imagePosition="left"
        />
      ))}
    </div>
  );
};
