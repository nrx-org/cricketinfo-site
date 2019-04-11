import React from "react";
import PropTypes from "prop-types";

export const Pill = ({ children, className }) => (
  <span className={`wcp-pill ${className}`}>{children}</span>
);

Pill.defaultProps = {
  className: ""
};

Pill.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string
};
