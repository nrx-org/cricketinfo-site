import React from "react";
import PropTypes from "prop-types";
import { Card } from "./Card";

export const LanguageCard = ({ url, title, coverImage, linkText }) => {
  return (
    <a href={url} className="wcp-language-card">
      <Card coverImage={coverImage} shadowSize="m">
        <span>{title}</span>
        {/* eslint-disable react/jsx-one-expression-per-line */}
        <a className="wcp-language-card__link-text" href={url}>
          {linkText} →
        </a>
      </Card>
    </a>
  );
};

LanguageCard.propTypes = {
  url: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  coverImage: PropTypes.string.isRequired,
  linkText: PropTypes.string.isRequired
};
