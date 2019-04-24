import React from "react";
import { PropTypes } from "prop-types";

import { IconButton } from "./IconButton";

export const FloatingToolbar = ({ onShareClick, openModal }) => {
  return (
    <div className="wcp-floating-toolbar">
      <div className="wcp-floating-toolbar__item">
        <a href={`/* TODO */`}>
          <IconButton
            name="bookmark"
            altText="Save for Later Icon"
            className="wcp-floating-toolbar__item__icon"
          />
          Save for later
        </a>
      </div>

      <div className="wcp-floating-toolbar__divider" />

      <div className="wcp-floating-toolbar__item">
        <button
          type="button"
          onClick={event => {
            onShareClick(event, openModal);
          }}
        >
          <IconButton
            name="share"
            altText="Share Icon"
            className="wcp-floating-toolbar__item__icon"
          />
          Share article
        </button>
      </div>
    </div>
  );
};

FloatingToolbar.propTypes = {
  onShareClick: PropTypes.func.isRequired,
  openModal: PropTypes.func.isRequired
};
