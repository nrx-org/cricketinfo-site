import React from "react";
import PropTypes from "prop-types";

import { WHATSAPP_SUBSCRIBE_MODAL_ID } from "../lib/modal_ids";

import { BottomSheet } from "./BottomSheet";
import { WhatsAppSubscribeModal } from "./WhatsAppSubscribeModal";

export class WhatsAppSubscribeModalContainer extends React.Component {
  constructor(props) {
    super(props);

    this.onCloseClick = this.onCloseClick.bind(this);

    props.registerModal(WHATSAPP_SUBSCRIBE_MODAL_ID, {
      onClose: props.onModalClose,
      onOpen: props.onModalOpen
    });
  }

  onCloseClick() {
    const { closeModal } = this.props;
    closeModal(WHATSAPP_SUBSCRIBE_MODAL_ID);
  }

  render() {
    const { isModalOpen, modalData, lang } = this.props;

    return (
      <BottomSheet
        size="2up"
        isOpen={isModalOpen(WHATSAPP_SUBSCRIBE_MODAL_ID)}
        onOverlayClick={this.onCloseClick}
      >
        <WhatsAppSubscribeModal
          articleId={modalData && (modalData.articleId || "")}
          lang={lang}
          close={this.onCloseClick}
          isOpen={isModalOpen(WHATSAPP_SUBSCRIBE_MODAL_ID)}
        />
      </BottomSheet>
    );
  }
}

WhatsAppSubscribeModalContainer.defaultProps = {
  modalData: null,
  onModalClose: null,
  onModalOpen: null
};

WhatsAppSubscribeModalContainer.propTypes = {
  registerModal: PropTypes.func.isRequired,
  isModalOpen: PropTypes.func.isRequired,
  modalData: PropTypes.shape({
    articleId: PropTypes.string
  }),
  closeModal: PropTypes.func.isRequired,
  onModalClose: PropTypes.func,
  onModalOpen: PropTypes.func,
  lang: PropTypes.string.isRequired
};
