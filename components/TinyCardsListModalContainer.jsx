import React, { Component } from "react";
import PropTypes from "prop-types";
import { TEAMS_LIST_MODAL_ID } from "../lib/modal_ids";
import { TinyCardsListModal } from "./TinyCardsListModal";

export class TinyCardsListModalContainer extends Component {
  constructor(props) {
    super(props);
    const { registerModal } = props;

    this.onClose = this.onClose.bind(this);

    registerModal(TEAMS_LIST_MODAL_ID);
  }

  onClose() {
    const { closeModal } = this.props;
    closeModal(TEAMS_LIST_MODAL_ID);
  }

  render() {
    const { isModalOpen, modalData } = this.props;

    return (
      <TinyCardsListModal
        isOpen={isModalOpen(TEAMS_LIST_MODAL_ID)}
        teams={modalData && modalData.items}
        onClose={this.onClose}
        title={modalData && modalData.title}
      />
    );
  }
}

TinyCardsListModalContainer.defaultProps = {
  modalData: null
};

TinyCardsListModalContainer.propTypes = {
  registerModal: PropTypes.func.isRequired,
  isModalOpen: PropTypes.func.isRequired,
  closeModal: PropTypes.func.isRequired,

  // eslint-disable-next-line react/forbid-prop-types
  modalData: PropTypes.object
};
