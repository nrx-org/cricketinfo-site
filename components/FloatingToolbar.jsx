import React from "react";
import { PropTypes } from "prop-types";

import { IconButton } from "./IconButton";

export const FloatingToolbar = ({ onShareClick, openModal }) => {
  return (
    <div className="wcp-floating-toolbar">
      <a href={`/* TODO */`} className="wcp-floating-toolbar__item">
        <IconButton
          name="bookmark"
          altText="Save for Later Icon"
          className="wcp-floating-toolbar__item__icon"
        />
        <span className="wcp-floating-toolbar__item__text">Save for later</span>
      </a>

      <div className="wcp-floating-toolbar__divider" />

      <button
        type="button"
        onClick={event => {
          onShareClick(event, openModal);
        }}
        className="wcp-floating-toolbar__item"
      >
        <IconButton
          name="share"
          altText="Share Icon"
          className="wcp-floating-toolbar__item__icon"
        />
        <span className="wcp-floating-toolbar__item__text">Share article</span>
      </button>
    </div>
  );
};

FloatingToolbar.propTypes = {
  onShareClick: PropTypes.func.isRequired,
  openModal: PropTypes.func.isRequired
};
