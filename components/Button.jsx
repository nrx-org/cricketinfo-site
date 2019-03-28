import React from "react";
import PropTypes from "prop-types";

export const Button = ({ children, type, className }) => {
  const buttonClass = type === "inverted" ? "wcp-button--inverted" : "";
  return (
    <button className={`wcp-button ${buttonClass} ${className}`} type="button">
      {children}
    </button>
  );
};

Button.defaultProps = {
  type: "",
  className: ""
};

Button.propTypes = {
  children: PropTypes.node.isRequired,
  type: PropTypes.oneOf(["inverted"]),
  className: PropTypes.string
};
