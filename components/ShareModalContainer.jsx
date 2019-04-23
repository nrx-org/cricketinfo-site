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

    props.registerModal(SHARE_MODAL_ID, {
      onClose: ShareModalContainer.onModalClose
    });

    this.state = {
      isLoading: false
    };
  }

  onCloseClick() {
    const { closeModal } = this.props;
    closeModal(SHARE_MODAL_ID);
  }

  render() {
    const { isModalOpen } = this.props;
    const { isLoading } = this.state;

    return (
      <BottomSheet
        isOpen={isModalOpen(SHARE_MODAL_ID)}
        onOverlayClick={this.onCloseClick}
      >
        <LanguageContext.Consumer>
          {lang => (
            <ShareModal
              isLoading={isLoading}
              onCloseClick={this.onCloseClick}
              lang={lang}
            />
          )}
        </LanguageContext.Consumer>
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
  closeModal: PropTypes.func.isRequired
};
