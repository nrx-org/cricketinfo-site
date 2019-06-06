import React from "react";
import PropTypes from "prop-types";
import { Image } from "./Image";

export const Icon = ({ name, className, altText, size }) => (
  <Image
    src={`/static/icons/${name}.svg`}
    alt={altText}
    className={`wcp-icon ${className} wcp-icon-size-${size}`}
  />
);

Icon.defaultProps = {
  className: "",
  size: "m"
};

Icon.propTypes = {
  name: PropTypes.string.isRequired,
  className: PropTypes.string,
  altText: PropTypes.string.isRequired,
  size: PropTypes.oneOf(["xs", "m", "l", "xl"])
};
