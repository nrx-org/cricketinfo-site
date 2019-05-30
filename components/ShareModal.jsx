import React from "react";
import PropTypes from "prop-types";

import { IconButtonWithText } from "./IconButtonWithText";
import { IconButton } from "./IconButton";
import { articleUiStrings } from "../lib/ui_strings";

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
        {articleUiStrings.shareOnWhatsApp[lang]}
      </IconButtonWithText>
      <IconButtonWithText
        name="facebook"
        altText="Facebook Icon"
        url={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`}
      >
        {articleUiStrings.shareOnFacebook[lang]}
      </IconButtonWithText>
      <IconButtonWithText name="copy" altText="Copy Icon" onClick={onCopyClick}>
        {articleUiStrings.copyLink[lang]}
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
