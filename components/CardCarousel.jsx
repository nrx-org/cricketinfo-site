import React from "react";
import PropTypes from "prop-types";

import { Card } from "./Card";

import { relatedContentPropTypes } from "../lib/prop_types";

export const CardCarousel = ({ relatedContent }) => {
  return (
    <div className="wcp-related-article-carousel">
      {relatedContent.map(a => (
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

CardCarousel.propTypes = {
  relatedContent: relatedContentPropTypes.isRequired
};
