import React from "react";
import PropTypes from "prop-types";

export const SectionTitle = ({ children }) => (
  <h1 className="wcp-section-title">{children}</h1>
);

SectionTitle.propTypes = {
  children: PropTypes.node.isRequired
};
