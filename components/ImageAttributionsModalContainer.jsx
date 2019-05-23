import React, { Component } from "react";
import PropTypes from "prop-types";

import { IMAGE_ATTRIBUTIONS_MODAL_ID } from "../lib/modal_ids";
import { ImageAttributionsModal } from "./ImageAttributionsModal";

export class ImageAttributionsModalContainer extends Component {
  constructor(props) {
    super(props);
    const { registerModal } = props;

    this.onClose = this.onClose.bind(this);

    registerModal(IMAGE_ATTRIBUTIONS_MODAL_ID);
  }

  onClose() {
    const { closeModal } = this.props;
    closeModal(IMAGE_ATTRIBUTIONS_MODAL_ID);
  }

  render() {
    const { isModalOpen, modalData } = this.props;

    return (
      <ImageAttributionsModal
        isOpen={isModalOpen(IMAGE_ATTRIBUTIONS_MODAL_ID)}
        teams={modalData && modalData.items}
        onClose={this.onClose}
        attributions={modalData && modalData.attributions}
      />
    );
  }
}

ImageAttributionsModalContainer.defaultProps = {
  modalData: null
};

ImageAttributionsModalContainer.propTypes = {
  registerModal: PropTypes.func.isRequired,
  isModalOpen: PropTypes.func.isRequired,
  closeModal: PropTypes.func.isRequired,

  // eslint-disable-next-line react/forbid-prop-types
  modalData: PropTypes.object
};
