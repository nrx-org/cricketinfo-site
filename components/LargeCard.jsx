import React from "react";
import PropTypes from "prop-types";

export const LargeCard = ({ href, coverImage, children }) => (
  <section className="wcp-large-card">
    <img src={coverImage.url} alt={coverImage.altText} />
    <p>{children}</p>
  </section>
);

LargeCard.propTypes = {};
