import React from "react";
import PropTypes from "prop-types";

import { IconButton } from "./IconButton";
import { LoadingSpinner } from "./LoadingSpinner";
import { IconButtonWithText } from "./IconButtonWithText";

export const ShareModal = ({ isLoading, onCloseClick, lang }) => {
  if (isLoading) {
    return <LoadingSpinner />;
  }
  const getCurrentUrl = () => {
    if (process.browser) return window.location.href;
    return null;
  };

  return (
    <div>
      <IconButton
        name="close"
        altText="Close Icon"
        size="l"
        onClick={onCloseClick}
      />
      <IconButtonWithText
        name="whatsapp"
        altText="WhatsApp Icon"
        text="Share on WhatsApp"
        url={`https://wa.me/?text=${getCurrentUrl()}`}
      >
        Share on Whatsapp
      </IconButtonWithText>
      <IconButtonWithText
        name="facebook"
        altText="Facebook Icon"
        text="Share on Facebook"
        url={`https://www.facebook.com/sharer/sharer.php?u=${getCurrentUrl()}`}
      >
        Share on facebook
      </IconButtonWithText>
    </div>
  );
};

ShareModal.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  onCloseClick: PropTypes.func.isRequired,
  lang: PropTypes.string.isRequired
};
