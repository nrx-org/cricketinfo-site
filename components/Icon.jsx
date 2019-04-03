import React from "react";
import PropTypes from "prop-types";

export const Icon = ({ name, className, altText }) => (
  <img
    src={`/static/icons/${name}.svg`}
    alt={altText}
    className={`wcp-icon ${className}`}
  />
);

Icon.defaultProps = {
  className: ""
};

Icon.propTypes = {
  name: PropTypes.string.isRequired,
  className: PropTypes.string,
  altText: PropTypes.string.isRequired
};
