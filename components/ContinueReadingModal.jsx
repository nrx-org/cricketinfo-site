import React from "react";
import PropTypes from "prop-types";
import { Button } from "./Button";
import { Icon } from "./Icon";
import { IconButton } from "./IconButton";
import { articleUiStrings } from "../lib/ui_strings";

export const ContinueReadingModal = ({ wikipediaUrl, lang, close }) => (
  <section className="wcp-continue-reading-modal">
    <div className="wcp-continue-reading-modal__header">
      <Icon name="wikipedia_logo" altText="Wikipedia logo" size="xl" />
      <h1>{articleUiStrings.readOnWikipedia[lang]}</h1>
      <IconButton onClick={close} altText="Close button" name="close" />
    </div>
    <div className="wcp-continue-reading-modal__body">
      <p>{articleUiStrings.readOnWikipediaConfirmation[lang]}</p>
    </div>
    <div className="wcp-continue-reading-modal__buttons">
      <Button href={wikipediaUrl} shouldOpenInNewTab isFullWidth>
        {articleUiStrings.yesReadMore[lang]}
      </Button>
      <Button isInverted isFullWidth onClick={close}>
        {articleUiStrings.noThanks[lang]}
      </Button>
    </div>
  </section>
);

ContinueReadingModal.propTypes = {
  lang: PropTypes.string.isRequired,
  close: PropTypes.func.isRequired,
  wikipediaUrl: PropTypes.string.isRequired
};
