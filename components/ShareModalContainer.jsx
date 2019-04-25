import React from "react";
import PropTypes from "prop-types";

import { LanguageContext } from "../language_context";
import { SHARE_MODAL_ID } from "../lib/modal_ids";

import { ShareModal } from "./ShareModal";
import { BottomSheet } from "./BottomSheet";

export class ShareModalContainer extends React.Component {
  static onModalClose() {
    document.body.classList.remove("noscroll");
  }

  constructor(props) {
    super(props);

    this.onCloseClick = this.onCloseClick.bind(this);
    this.onCopyClick = this.onCopyClick.bind(this);
    this.urlInput = React.createRef();

    props.registerModal(SHARE_MODAL_ID, {
      onClose: ShareModalContainer.onModalClose
    });

    this.state = {
      isLoading: false,
      isUrlCopied: false
    };
  }

  onCloseClick() {
    const { closeModal } = this.props;
    closeModal(SHARE_MODAL_ID);
  }

  onCopyClick() {
    this.urlInput.current.select();
    document.execCommand("copy");
    this.setState({ isUrlCopied: true });
  }

  render() {
    const { isModalOpen, modalData, lang } = this.props;
    const { isLoading, isUrlCopied } = this.state;

    return (
      <BottomSheet
        size="1up"
        isOpen={isModalOpen(SHARE_MODAL_ID)}
        onOverlayClick={this.onCloseClick}
      >
        <ShareModal
          isLoading={isLoading}
          isUrlCopied={isUrlCopied}
          onCloseClick={this.onCloseClick}
          onCopyClick={this.onCopyClick}
          shareUrl={modalData && (modalData.url || "")}
          lang={lang}
        />
        <input
          className="wcp-share-fact-bottom-sheet__input"
          ref={this.urlInput}
          type="text"
          value={modalData && (modalData.url || "")}
        />
      </BottomSheet>
    );
  }
}

ShareModalContainer.contextType = LanguageContext;

ShareModalContainer.defaultProps = {
  modalData: null
};

ShareModalContainer.propTypes = {
  registerModal: PropTypes.func.isRequired,
  isModalOpen: PropTypes.func.isRequired,
  modalData: PropTypes.shape({
    articleId: PropTypes.string // TODO Change to reflect shareData
  }),
  closeModal: PropTypes.func.isRequired,
  lang: PropTypes.string.isRequired
};
