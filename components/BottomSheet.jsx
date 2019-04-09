/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */

import React from "react";
import PropTypes from "prop-types";

export const BottomSheet = ({ isOpen, onOverlayClick, children }) => {
  const openClassName = isOpen ? "wcp-bottom-sheet--open" : "";
  return (
    <>
      <div
        className={`wcp-bottom-sheet__overlay ${openClassName}`}
        onClick={onOverlayClick}
      />
      <div className={`wcp-bottom-sheet ${openClassName}`}>{children}</div>
    </>
  );
};

BottomSheet.defaultProps = {
  isOpen: false,
  onOverlayClick: () => ({})
};

BottomSheet.propTypes = {
  isOpen: PropTypes.bool,
  children: PropTypes.node.isRequired,
  onOverlayClick: PropTypes.func
};
