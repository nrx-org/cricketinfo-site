import React from "react";
import { PropTypes } from "prop-types";

import { IconButtonWithText } from "./IconButtonWithText";

export const FloatingToolbar = ({ onShareClick, openModal }) => {
  return (
    <div>
      <IconButtonWithText
        name="bookmark"
        altText="Save for Later Icon"
        url="thuibns"
      >
        Save for later
      </IconButtonWithText>
      <IconButtonWithText
        name="share"
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
