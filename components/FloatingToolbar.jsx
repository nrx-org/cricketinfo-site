import React from "react";
import { PropTypes } from "prop-types";

export const FloatingToolbar = ({ leftButton, rightButton }) => {
  return (
    <div className="wcp-floating-toolbar">
      <div className="wcp-floating-toolbar__button-container">{leftButton}</div>
      <div className="wcp-floating-toolbar__button-container">
        {rightButton}
      </div>
    </div>
  );
};

FloatingToolbar.propTypes = {
  leftButton: PropTypes.node.isRequired,
  rightButton: PropTypes.node.isRequired
};
