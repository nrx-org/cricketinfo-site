import React from "react";
import PropTypes from "prop-types";

export const BottomSheet = ({ isOpen, children }) => {
  const openClassName = isOpen ? "wcp-bottom-sheet--open" : "";
  return (
    <>
      <div className={`wcp-bottom-sheet__overlay ${openClassName}`} />
      <div className={`wcp-bottom-sheet ${openClassName}`}>{children}</div>
    </>
  );
};

BottomSheet.defaultProps = {
  isOpen: false
};

BottomSheet.propTypes = {
  isOpen: PropTypes.bool,
  children: PropTypes.node.isRequired
};
