import React from "react";
import { factPropTypes } from "../lib/prop_types";

export const Avatar = ({ card }) => (
  <a href={card.value.url} className="wcp-avatar">
    <div className="wcp-avatar__outline">
      <div className="wcp-avatar__image__container">
        <img
          className="wcp-avatar__image"
          src={card.value.image.url}
          alt={card.value.image.altText}
        />
      </div>
    </div>
    <div className="wcp-avatar__label wcp-font-family-body">{card.label}</div>
  </a>
);

Avatar.propTypes = {
  card: factPropTypes.isRequired
};
