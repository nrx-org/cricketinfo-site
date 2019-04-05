import React from "react";
import PropTypes from "prop-types";
import { Card } from "./Card";
import { imagePropTypes } from "../lib/prop_types";

export const LanguageCard = ({
  url,
  title,
  coverImage,
  coverImageClassName,
  linkText
}) => {
  return (
    <a href={url} className="wcp-language-card">
      <Card
        coverImage={coverImage}
        coverImageClassName={coverImageClassName}
        shadowSize="m"
      >
        <span>{title}</span>
        {/* eslint-disable react/jsx-one-expression-per-line */}
        <span className="wcp-language-card__link-text">{linkText} →</span>
      </Card>
    </a>
  );
};

LanguageCard.defaultProps = {
  coverImageClassName: ""
};

LanguageCard.propTypes = {
  url: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  coverImage: imagePropTypes.isRequired,
  coverImageClassName: PropTypes.string,
  linkText: PropTypes.string.isRequired
};
