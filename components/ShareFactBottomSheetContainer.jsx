import React from "react";
import PropTypes from "prop-types";

import { ModalContextConsumer } from "./ModalContext";
import { BottomSheet } from "./BottomSheet";
import { Button } from "./Button";
import { LanguageContext } from "../language_context";

import { SHARE_FACT_CARD_BOTTOM_SHEET_ID } from "../lib/modal_ids";

const I18N_URL_COPY_SUCCESS_MESSAGE = {
  en: "Share link copied!",
  hi: "शेयर लिंक काॅपी कर लिया गया है!"
};

class ShareFactBottomSheet extends React.Component {
  constructor(props) {
    super(props);

    const { registerModal } = props;
    registerModal(SHARE_FACT_CARD_BOTTOM_SHEET_ID);

    this.urlInput = React.createRef();

    this.state = {
      isUrlCopied: false
    };

    this.onCloseClick = this.onCloseClick.bind(this);
    this.onCopyClick = this.onCopyClick.bind(this);
  }

  onCloseClick() {
    const { closeModal } = this.props;
    closeModal(SHARE_FACT_CARD_BOTTOM_SHEET_ID);
  }

  onCopyClick() {
    this.urlInput.current.select();
    document.execCommand("copy");
    this.setState({ isUrlCopied: true });
  }

  render() {
    const { isModalOpen, modalData, lang } = this.props;
    const { isUrlCopied } = this.state;

    return (
      <BottomSheet
        size="2up"
        onOverlayClick={this.onCloseClick}
        isOpen={isModalOpen(SHARE_FACT_CARD_BOTTOM_SHEET_ID)}
      >
        <div className="wcp-share-fact-bottom-sheet">
          <div className="wcp-share-fact-bottom-sheet__input-wrapper">
            <input
              onClick={this.onCopyClick}
              className="wcp-share-fact-bottom-sheet__input"
              ref={this.urlInput}
              readOnly="readonly"
              type="text"
              value={modalData && (modalData.shareUrl || "")}
            />
            {isUrlCopied && <p>{I18N_URL_COPY_SUCCESS_MESSAGE[lang]}</p>}
          </div>
          <div className="wcp-share-fact-bottom-sheet__button-group">
            <Button onClick={this.onCopyClick}>Copy</Button>
            <Button
              className="wcp-share-fact-bottom-sheet__button-close"
              type="inverted"
              onClick={this.onCloseClick}
            >
              Close
            </Button>
          </div>
        </div>
      </BottomSheet>
    );
  }
}

ShareFactBottomSheet.defaultProps = {
  modalData: null
};

ShareFactBottomSheet.propTypes = {
  lang: PropTypes.string.isRequired,
  registerModal: PropTypes.func.isRequired,
  closeModal: PropTypes.func.isRequired,
  isModalOpen: PropTypes.func.isRequired,
  modalData: PropTypes.shape({ shareUrl: PropTypes.string.isRequired })
};

export const ShareFactBottomSheetContainer = () => {
  return (
    <LanguageContext.Consumer>
      {lang => (
        <ModalContextConsumer>
          {({ registerModal, isModalOpen, modalData, closeModal }) => (
            <ShareFactBottomSheet
              lang={lang}
              registerModal={registerModal}
              isModalOpen={isModalOpen}
              modalData={modalData}
              closeModal={closeModal}
            />
          )}
        </ModalContextConsumer>
      )}
    </LanguageContext.Consumer>
  );
};
