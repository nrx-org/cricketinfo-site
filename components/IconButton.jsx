import React from "react";
import PropTypes from "prop-types";
import { Icon } from "./Icon";

export const IconButton = ({ name, altText, className, onClick, size }) => {
  return (
    <button
      className={`wcp-icon-button ${className}`}
      type="button"
      onClick={onClick}
    >
      <Icon name={name} altText={altText} size={size} />
    </button>
  );
};

IconButton.defaultProps = {
  className: "",
  size: "m"
};

IconButton.propTypes = {
  name: PropTypes.string.isRequired,
  altText: PropTypes.string.isRequired,
  className: PropTypes.string,
  onClick: PropTypes.func.isRequired,
  size: PropTypes.oneOf(["m", "l"])
};
