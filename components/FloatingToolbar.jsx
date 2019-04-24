import React from "react";
import { PropTypes } from "prop-types";

import { IconButtonWithText } from "./IconButtonWithText";

export const FloatingToolbar = ({ onShareClick, openModal }) => {
  return (
    <div className="wcp-floating-toolbar">
      <IconButtonWithText
        name="bookmark"
        altText="Save for Later Icon"
        // TODO
        url="thuibns"
      >
        Save for later
      </IconButtonWithText>
      <div className="wcp-floating-toolbar__divider" />
      <IconButtonWithText
        name="share_toolbar"
        altText="Share Icon"
        onClick={event => {
          onShareClick(event, openModal);
        }}
      >
        Share article
      </IconButtonWithText>
    </div>
  );
};

FloatingToolbar.propTypes = {
  onShareClick: PropTypes.func.isRequired,
  openModal: PropTypes.func.isRequired
};
