import React from "react";
import PropTypes from "prop-types";
import { Card } from "./Card";

export const LanguageCard = ({ url, title, coverImage, linkText }) => {
  return (
    <Card coverImage={coverImage}>
      <span>{title}</span>
      {/* eslint-disable react/jsx-one-expression-per-line */}
      <a href={url}>{linkText} →</a>
    </Card>
  );
};

LanguageCard.propTypes = {
  url: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  coverImage: PropTypes.string.isRequired,
  linkText: PropTypes.string.isRequired
};
