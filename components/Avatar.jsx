import React from "react";
import { factPropTypes } from "../lib/prop_types";

import ArticleSummaryLink from "./ArticleSummaryLink";
import { Image } from "./Image";

export const Avatar = ({ card }) => (
  <ArticleSummaryLink href={card.value.url} className="wcp-avatar">
    <div className="wcp-avatar__outline">
      <div className="wcp-avatar__image__container">
        <Image
          className="wcp-avatar__image"
          src={card.value.image.url}
          alt={card.value.image.altText}
        />
      </div>
    </div>
    <div className="wcp-avatar__label wcp-font-family-body">{card.label}</div>
  </ArticleSummaryLink>
);

Avatar.propTypes = {
  card: factPropTypes.isRequired
};
