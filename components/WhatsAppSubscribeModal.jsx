import React, { Component } from "react";
import PropTypes from "prop-types";

import { Button } from "./Button";
import { Icon } from "./Icon";
import { getAbsoluteArticleUrl, getPdfShareUrl } from "../lib/urls";
import { articleUiStrings, commonUiStrings } from "../lib/ui_strings";

import track, { useTracking } from "react-tracking";
import {
  SAVE_FOR_LATER_SHARE_NUMBER,
  SAVE_FOR_LATER_INTERESTED,
  SAVE_FOR_LATER_DOWNLOAD_PDF
} from "../lib/matomo";

const GET_UPDATES_MESSAGE = {
  en: "Get updates on WhatsApp",
  hi: "व्हाट्सएप पर अपडेट पाएं",
  ta: "TODO"
};

const CONFIRM_SUBSCRIPTION_MESSAGE = {
  en: "Do you want similar fun and engaging information on WhatsApp?",
  hi:
    "क्या आप व्हाट्सएप पर इसी तरह की रोचक और मनोरंजक जानकारी प्राप्त करना चाहते हैं?",
  ta: "TODO"
};

const BUTTON_MESSAGE_YES = {
  en: "Yes, I'm interested",
  hi: "हाँ",
  ta: "TODO"
};

const BUTTON_MESSAGE_NO = {
  en: "No",
  hi: "नहीं",
  ta: "TODO"
};

const ENTER_NUMBER_MESSAGE = {
  en:
    "Enter your WhatsApp number below to start receiving interesting articles on your WhatsApp.",
  hi: "TODO",
  ta: "TODO"
};

const ENTER_NUMBER_INPUT_PLACEHOLDER_MESSAGE = {
  en: "Enter WhatsApp number",
  hi: "TODO",
  ta: "TODO"
};

const BUTTON_MESSAGE_SUBSCRIBE = {
  en: "Subscribe to updates",
  hi: "TODO",
  ta: "TODO"
};

const BUTTON_MESSAGE_CLOSE = {
  en: "Close",
  hi: "TODO",
  ta: "TODO"
};

const BUTTON_MESSAGE_DOWNLOAD_PDF = {
  en: "Download PDF",
  hi: "TODO",
  ta: "TODO"
};

const ERROR_SUBSCRIBING_MESSAGE = {
  en:
    "There was an error while subscribing you to WhatsApp updates. Please try again.",
  hi: "TODO",
  ta: "TODO"
};

const STEP_CONFIRM = "STEP_CONFIRM";
const STEP_INPUT_NUMBER = "STEP_INPUT_NUMBER";
const STEP_DOWNLOAD_PDF = "STEP_DOWNLOAD_PDF";

@track({component: 'WhatsAppSubscribeModal'})
export class WhatsAppSubscribeModal extends Component {
  constructor(props) {
    super(props);

    this.onAgreeClick = this.onAgreeClick.bind(this);
    this.onSubmitNumber = this.onSubmitNumber.bind(this);
    this.onDownloadPDFClick = this.onDownloadPDFClick.bind(this);

    this.state = {
      currentStep: STEP_CONFIRM
    };
  }

  componentDidUpdate(prevProps) {
    const { isOpen } = this.props;

    if (isOpen !== prevProps.isOpen) {
      // TODO: very dirty code, but we have to release in 3 days and I can't think of anything better.
      // eslint-disable-next-line react/no-did-update-set-state
      setTimeout(() => this.setState({ currentStep: STEP_CONFIRM }), 500);
    }
  }

  @track(SAVE_FOR_LATER_INTERESTED)
  onAgreeClick(event) {
    event.preventDefault();
    this.setState({ currentStep: STEP_INPUT_NUMBER });
  }

  @track(SAVE_FOR_LATER_SHARE_NUMBER)
  onSubmitNumber(event) {
    event.preventDefault();
    this.setState({ currentStep: STEP_DOWNLOAD_PDF });
  }

  @track(SAVE_FOR_LATER_DOWNLOAD_PDF)
  onDownloadPDFClick(event) {
    const { lang, articleId } = this.props;
    window.location.href = getPdfShareUrl(getAbsoluteArticleUrl(articleId, lang))
  }

  render() {
    const { lang, close, articleId } = this.props;
    const { currentStep } = this.state;

    return (
      <section className="wcp-whatsapp-subscribe-modal">
        <div className="wcp-whatsapp-subscribe-modal__header">
          <Icon size="xl" altText="WhatsApp logo" name="whatsapp" />
          <h1>{articleUiStrings.getUpdatesOnWhatsApp[lang]}</h1>
        </div>
        {currentStep === STEP_CONFIRM ? (
          <>
            <p className="wcp-whatsapp-subscribe-modal__body-text">
              {articleUiStrings.confirmSubscription[lang]}
            </p>
            <div className="wcp-whatsapp-subscribe-modal__button-container">
              <Button onClick={this.onAgreeClick}>
                {articleUiStrings.yesImInterested[lang]}
              </Button>
              <Button isInverted onClick={close}>
                {commonUiStrings.no[lang]}
              </Button>
            </div>
          </>
        ) : null}
        {currentStep === STEP_INPUT_NUMBER ? (
          <>
            <p className="wcp-whatsapp-subscribe-modal__body-text">
              {articleUiStrings.enterNumber[lang]}
            </p>
            <div className="wcp-whatsapp-subscribe-modal__button-container">
              <input
                placeholder={articleUiStrings.enterNumberInput[lang]}
                className="wcp-whatsapp-subscribe-modal__input"
                type="text"
              />
              <Button onClick={this.onSubmitNumber}>
                {articleUiStrings.subscribeToUpdates[lang]}
              </Button>
            </div>
          </>
        ) : null}
        {currentStep === STEP_DOWNLOAD_PDF ? (
          <>
            <p className="wcp-whatsapp-subscribe-modal__body-text">
              {articleUiStrings.whatsAppSubscribeError[lang]}
            </p>
            <div className="wcp-whatsapp-subscribe-modal__button-container">
              <Button
                onClick={this.onDownloadPDFClick}
              >
                {articleUiStrings.downloadPdf[lang]}
              </Button>
              <Button isInverted onClick={close}>
                {commonUiStrings.close[lang]}
              </Button>
            </div>
          </>
        ) : null}
      </section>
    );
  }
}

WhatsAppSubscribeModal.propTypes = {
  lang: PropTypes.string.isRequired,
  close: PropTypes.func.isRequired,
  articleId: PropTypes.string.isRequired,
  isOpen: PropTypes.bool.isRequired
};
