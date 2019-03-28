import React from "react";
import PropTypes from "prop-types";

export const Button = ({ label, type }) => {
  const buttonClass = type === "inverted" ? "wcp-button--inverted" : "";
  return (
    <button className={`wcp-button ${buttonClass}`} type="button">
      {label}
    </button>
  );
};

Button.defaultProps = {
  type: ""
};

Button.propTypes = {
  label: PropTypes.string.isRequired,
  type: PropTypes.oneOf(["inverted"])
};
