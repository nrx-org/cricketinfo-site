/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */

import React, { Component } from "react";
import PropTypes from "prop-types";

export class BottomSheet extends Component {
  componentDidUpdate(prevProps) {
    const { isOpen } = this.props;

    if (!prevProps.isOpen && isOpen) {
      // Modal is opening.
      document.body.classList.add("noscroll");
    } else if (prevProps.isOpen && !isOpen) {
      // Modal is closing.
      document.body.classList.remove("noscroll");
    }
  }

  render() {
    const { isOpen, onOverlayClick, size, children } = this.props;
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
  }
}

BottomSheet.defaultProps = {
  isOpen: false,
  onOverlayClick: () => ({}),
  size: "3up"
};

BottomSheet.propTypes = {
  isOpen: PropTypes.bool,
  children: PropTypes.node.isRequired,
  onOverlayClick: PropTypes.func,
  size: PropTypes.oneOf(["1up", "2up", "3up", "4up", "noup"])
};
