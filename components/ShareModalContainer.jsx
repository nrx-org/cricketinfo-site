import React from "react";
import PropTypes from "prop-types";
import * as cogoToast from "cogo-toast";

import { LanguageContext } from "../language_context";
import { SHARE_MODAL_ID } from "../lib/modal_ids";
import { articleUiStrings } from "../lib/ui_strings";

import { ShareModal } from "./ShareModal";
import { BottomSheet } from "./BottomSheet";

export class ShareModalContainer extends React.Component {
  constructor(props) {
    super(props);

    this.onCloseClick = this.onCloseClick.bind(this);
    this.onCopyClick = this.onCopyClick.bind(this);
    this.urlInput = React.createRef();

    props.registerModal(SHARE_MODAL_ID, {
      onClose: props.onModalClose || null,
      onOpen: props.onModalOpen || null
    });
  }

  onCloseClick() {
    const { closeModal } = this.props;
    closeModal(SHARE_MODAL_ID);
  }

  onCopyClick() {
    const { lang, closeModal } = this.props;

    this.urlInput.current.select();
    document.execCommand("copy");

    cogoToast.success(articleUiStrings.shareLinkCopied[lang], {
      bar: {
        size: "0px"
      }
    });

    setTimeout(() => closeModal(SHARE_MODAL_ID), 300);
  }

  render() {
    const { isModalOpen, modalData, lang } = this.props;

    return (
      <BottomSheet
        size="1up"
        isOpen={isModalOpen(SHARE_MODAL_ID)}
        onOverlayClick={this.onCloseClick}
      >
        <ShareModal
          onCloseClick={this.onCloseClick}
          onCopyClick={this.onCopyClick}
          shareUrl={modalData && (modalData.url || "")}
          lang={lang}
        />
        <input
          readOnly="readonly"
          className="wcp-share-modal__input"
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
  modalData: null,
  onModalClose: null,
  onModalOpen: null
};

ShareModalContainer.propTypes = {
  registerModal: PropTypes.func.isRequired,
  isModalOpen: PropTypes.func.isRequired,
  modalData: PropTypes.shape({
    url: PropTypes.string,
    articleId: PropTypes.string // TODO Change to reflect shareData
  }),
  closeModal: PropTypes.func.isRequired,
  onModalClose: PropTypes.func,
  onModalOpen: PropTypes.func,
  lang: PropTypes.string.isRequired
};
