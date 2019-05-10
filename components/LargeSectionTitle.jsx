import React from "react";
import PropTypes from "prop-types";

export const LargeSectionTitle = ({ children }) => (
  <h1 className="wcp-large-section-title">{children}</h1>
);

LargeSectionTitle.propTypes = {
  children: PropTypes.node.isRequired
};
