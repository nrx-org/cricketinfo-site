import React from "react";
import PropTypes from "prop-types";

import { LoadingSpinner } from "./LoadingSpinner";
import { IconButtonWithText } from "./IconButtonWithText";
import { IconButton } from "./IconButton";

const SHARE_TEXT = {
  facebook: {
    en: "Share on Facebook",
    hi: "TODO"
  },
  whatsapp: {
    en: "Share on Whatsapp",
    hi: "TODO"
  },
  copy: {
    en: "Copy link to share",
    hi: "TODO"
  }
};

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
        {SHARE_TEXT.whatsapp[lang]}
      </IconButtonWithText>
      <IconButtonWithText
        name="facebook"
        altText="Facebook Icon"
        url={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`}
      >
        {SHARE_TEXT.facebook[lang]}
      </IconButtonWithText>
      <IconButtonWithText name="copy" altText="Copy Icon" onClick={onCopyClick}>
        {/* TODO */}
        {/* {isUrlCopied && <p>{I18N_URL_COPY_SUCCESS_MESSAGE[lang]}</p>} */}
        {SHARE_TEXT.copy[lang]}
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
