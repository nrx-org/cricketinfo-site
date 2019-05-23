import React from "react";
import PropTypes from "prop-types";

import { CONTINUE_READING_MODAL_ID } from "../lib/modal_ids";

import { BottomSheet } from "./BottomSheet";
import { ContinueReadingModal } from "./ContinueReadingModal";

export class ContinueReadingModalContainer extends React.Component {
  constructor(props) {
    super(props);

    this.onCloseClick = this.onCloseClick.bind(this);

    props.registerModal(CONTINUE_READING_MODAL_ID);
  }

  onCloseClick() {
    const { closeModal } = this.props;
    closeModal(CONTINUE_READING_MODAL_ID);
  }

  render() {
    const { isModalOpen, modalData, lang } = this.props;

    return (
      <BottomSheet
        size="2up"
        isOpen={isModalOpen(CONTINUE_READING_MODAL_ID)}
        onOverlayClick={this.onCloseClick}
      >
        <ContinueReadingModal
          lang={lang}
          close={this.onCloseClick}
          isOpen={isModalOpen(CONTINUE_READING_MODAL_ID)}
          wikipediaUrl={modalData && (modalData.wikipediaUrl || null)}
        />
      </BottomSheet>
    );
  }
}

ContinueReadingModalContainer.defaultProps = {
  modalData: null
};

ContinueReadingModalContainer.propTypes = {
  registerModal: PropTypes.func.isRequired,
  isModalOpen: PropTypes.func.isRequired,
  closeModal: PropTypes.func.isRequired,
  lang: PropTypes.string.isRequired,

  // eslint-disable-next-line react/forbid-prop-types
  modalData: PropTypes.object
};
