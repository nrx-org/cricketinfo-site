import React, { Component } from "react";
import PropTypes from "prop-types";
import { TEAMS_LIST_MODAL_ID } from "../lib/modal_ids";
import { TeamsListModal } from "./TeamsListModal";
import { factPropTypes } from "../lib/prop_types";

export class TeamsListModalContainer extends Component {
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
    const { isModalOpen, teams } = this.props;

    if (!isModalOpen(TEAMS_LIST_MODAL_ID)) {
      return null;
    }

    return <TeamsListModal teams={teams} onClose={this.onClose} />;
  }
}

TeamsListModalContainer.defaultProps = {
  teams: []
};

TeamsListModalContainer.propTypes = {
  registerModal: PropTypes.func.isRequired,
  isModalOpen: PropTypes.func.isRequired,
  closeModal: PropTypes.func.isRequired,
  teams: PropTypes.arrayOf(factPropTypes)
};
