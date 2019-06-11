import React from "react";
import PropTypes from "prop-types";

import { LOADING_SPINNER_MODAL_ID } from "../lib/modal_ids";

import { LoadingSpinner } from "./LoadingSpinner";
import { BottomSheet } from "./BottomSheet";

export class LoadingSpinnerModalContainer extends React.Component {
  constructor(props) {
    super(props);

    this.onCloseClick = this.onCloseClick.bind(this);
    props.registerModal(LOADING_SPINNER_MODAL_ID);
  }

  onCloseClick() {
    const { closeModal } = this.props;
    closeModal(LOADING_SPINNER_MODAL_ID);
  }

  render() {
    const { isModalOpen } = this.props;

    return (
      <BottomSheet
        size="1up"
        isOpen={isModalOpen(LOADING_SPINNER_MODAL_ID)}
        onOverlayClick={this.onCloseClick}
      >
        <LoadingSpinner />
      </BottomSheet>
    );
  }
}

LoadingSpinnerModalContainer.propTypes = {
  registerModal: PropTypes.func.isRequired,
  isModalOpen: PropTypes.func.isRequired,
  closeModal: PropTypes.func.isRequired
};
