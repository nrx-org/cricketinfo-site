import React from "react";
import PropTypes from "prop-types";

import { LoadingSpinner } from "./LoadingSpinner";
import { IconButtonWithText } from "./IconButtonWithText";
import { IconButton } from "./IconButton";

export const ShareModal = ({
  isLoading,
  isUrlCopied,
  onCloseClick,
  onCopyClick,
  shareUrl,
  lang
}) => {
  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="wcp-share-modal">
      <IconButton
        name="close"
        altText="Close Icon"
        onClick={onCloseClick}
        className="wcp-share-modal__close-icon"
      />
      <IconButtonWithText
        name="whatsapp"
        altText="WhatsApp Icon"
        url={`https://wa.me/?text=${shareUrl}`}
      >
        Share on Whatsapp
      </IconButtonWithText>
      <IconButtonWithText
        name="facebook"
        altText="Facebook Icon"
        url={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`}
      >
        Share on Facebook
      </IconButtonWithText>
      <IconButtonWithText name="copy" altText="Copy Icon" onClick={onCopyClick}>
      {/* TODO */}
        {/* {isUrlCopied && <p>{I18N_URL_COPY_SUCCESS_MESSAGE[lang]}</p>} */}
        Copy link to share
      </IconButtonWithText>
    </div>
  );
};

ShareModal.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  isUrlCopied: PropTypes.bool.isRequired,
  onCloseClick: PropTypes.func.isRequired,
  onCopyClick: PropTypes.func.isRequired,
  shareUrl: PropTypes.string.isRequired,
  lang: PropTypes.string.isRequired
};
