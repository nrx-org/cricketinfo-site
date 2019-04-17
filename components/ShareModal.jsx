import React from "react";
import PropTypes from "prop-types";

import { LanguageContext } from "../language_context";

import { Icon } from "./Icon";
import { IconButton } from "./IconButton";
import { LoadingSpinner } from "./LoadingSpinner";
import { IconButtonWithText } from "./IconButtonWithText";

export const ShareModal = props => (
  <LanguageContext.Consumer>
    {lang => <ShareModalInternal lang={lang} {...props} />}
  </LanguageContext.Consumer>
);

const ShareModalInternal = ({ isLoading, onCloseClick, lang }) => {
  if (isLoading) {
    return <LoadingSpinner />;
  }

  const currentUrl = window.location.href;

  return (
    <div>
      <IconButton
        name="close"
        altText="Close Icon"
        size="l"
        onClick={onCloseClick}
      />
      <IconButtonWithText
        name="twitter"
        altText="Twitter Icon"
        text="Share on Twitter"
        onClick={`http://www.twitter.com/share?url=${currentUrl}`}
      />
      <IconButtonWithText
        name="facebook"
        altText="Facebook Icon"
        text="Share on Facebook"
        onClick={`https://www.facebook.com/sharer/sharer.php?u=${currentUrl}`}
      />
      <IconButtonWithText
        name="whatsapp"
        altText="WhatsApp Icon"
        text="Share on WhatsApp"
        onClick={`https://wa.me/?text=${currentUrl}`}
      />
    </div>
  );
};

ShareModalInternal.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  onCloseClick: PropTypes.func.isRequired,
  lang: PropTypes.string.isRequired
};
