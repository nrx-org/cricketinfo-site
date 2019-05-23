import React from "react";
import PropTypes from "prop-types";
import { Button } from "./Button";
import { Icon } from "./Icon";
import { IconButton } from "./IconButton";

const READ_MORE_TITLE_MESSAGE = {
  en: "Read more on Wikipedia",
  hi: "TODO",
  ta: "TODO"
};

const CONTINUE_READING_MESSAGE = {
  en: "Would you like to read more about this topic on Wikipedia?",
  hi: "TODO",
  ta: "TODO"
};

const YES_READ_MORE_MESSAGE = {
  en: "Yes, read more",
  hi: "",
  ta: ""
};

const NO_THANKS_MESSAGE = {
  en: "No, thanks",
  hi: "",
  ta: ""
};

export const ContinueReadingModal = ({ wikipediaUrl, lang, close }) => (
  <section className="wcp-continue-reading-modal">
    <div className="wcp-continue-reading-modal__header">
      <Icon name="wikipedia_logo" altText="Wikipedia logo" size="xl" />
      <h1>{READ_MORE_TITLE_MESSAGE[lang]}</h1>
      <IconButton onClick={close} altText="Close button" name="close" />
    </div>
    <div className="wcp-continue-reading-modal__body">
      <p>{CONTINUE_READING_MESSAGE[lang]}</p>
    </div>
    <div className="wcp-continue-reading-modal__buttons">
      <Button href={wikipediaUrl} shouldOpenInNewTab isFullWidth>
        {YES_READ_MORE_MESSAGE[lang]}
      </Button>
      <Button isInverted isFullWidth onClick={close}>
        {NO_THANKS_MESSAGE[lang]}
      </Button>
    </div>
  </section>
);

ContinueReadingModal.propTypes = {
  lang: PropTypes.string.isRequired,
  close: PropTypes.func.isRequired,
  wikipediaUrl: PropTypes.string.isRequired
};
