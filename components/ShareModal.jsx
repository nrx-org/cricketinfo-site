import React from "react";
import PropTypes from "prop-types";

import { IconButtonWithText } from "./IconButtonWithText";
import { IconButton } from "./IconButton";

const SHARE_TEXT = {
  facebook: {
    en: "Share on Facebook",
    hi: "फेसबुक पर शेयर करें"
  },
  whatsapp: {
    en: "Share on Whatsapp",
    hi: "वॉट्सएप पर शेयर करें"
  },
  copy: {
    en: "Copy link to share",
    hi: "लिंक कॉपी करें"
  }
};

export const ShareModal = ({ onCloseClick, onCopyClick, shareUrl, lang }) => {
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
        {SHARE_TEXT.copy[lang]}
      </IconButtonWithText>
    </div>
  );
};

ShareModal.propTypes = {
  onCloseClick: PropTypes.func.isRequired,
  onCopyClick: PropTypes.func.isRequired,
  shareUrl: PropTypes.string.isRequired,
  lang: PropTypes.string.isRequired
};
