/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */

import React from "react";
import PropTypes from "prop-types";

export const BottomSheet = ({ isOpen, onOverlayClick, size, children }) => {
  const openClassName = isOpen ? "wcp-bottom-sheet--open" : "";
  const sizeClassName = `wcp-bottom-sheet--${size}`;

  return (
    <>
      <div
        className={`wcp-bottom-sheet__overlay ${openClassName}`}
        onClick={onOverlayClick}
      />
      <div className={`wcp-bottom-sheet ${sizeClassName} ${openClassName}`}>
        {children}
      </div>
    </>
  );
};

BottomSheet.defaultProps = {
  isOpen: false,
  onOverlayClick: () => ({}),
  size: "3up"
};

BottomSheet.propTypes = {
  isOpen: PropTypes.bool,
  children: PropTypes.node.isRequired,
  onOverlayClick: PropTypes.func,
  size: PropTypes.oneOf(["1up", "2up", "3up", "4up"])
};
