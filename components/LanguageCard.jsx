import React from "react";
import PropTypes from "prop-types";

import { Icon } from "./Icon";

import { imagePropTypes } from "../lib/prop_types";

export const LanguageCard = ({ url, title, coverImage, linkText }) => {
  return (
    <a href={url} className="wcp-language-card">
      <img
        className="wcp-language-card__cover-image"
        src={coverImage.url}
        alt={coverImage.altText}
      />
      <div className="wcp-language-card__content">
        <span>{title}</span>
        {/* eslint-disable react/jsx-one-expression-per-line */}
        <span className="wcp-language-card__link-text">
          {linkText}{" "}
          <Icon
            className="wcp-language-card__link-text__icon"
            altText="Go to language"
            name="arrow_right"
            size="xs"
          />
        </span>
      </div>
    </a>
  );
};

LanguageCard.propTypes = {
  url: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  coverImage: imagePropTypes.isRequired,
  linkText: PropTypes.string.isRequired
};
