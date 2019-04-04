import React from "react";
import PropTypes from "prop-types";

import { ARTICLE_SUMMARY_MODAL_ID } from "../lib/modal_ids";
import { BottomSheet } from "./BottomSheet";

export class ArticleSummaryModal extends React.Component {
  constructor(props) {
    super(props);
    props.registerModal(ARTICLE_SUMMARY_MODAL_ID);

    this.onCloseClick = this.onCloseClick.bind(this);
  }

  onCloseClick() {
    const { closeModal } = this.props;
    closeModal(ARTICLE_SUMMARY_MODAL_ID);
  }

  render() {
    const { isModalOpen, modalData } = this.props;

    return (
      <BottomSheet
        isOpen={isModalOpen(ARTICLE_SUMMARY_MODAL_ID)}
        close={this.onCloseClick}
      >
        <h1>{modalData && modalData.articleId}</h1>
        <button type="button" onClick={this.onCloseClick}>
          Close
        </button>
      </BottomSheet>
    );
  }
}

ArticleSummaryModal.propTypes = {
  registerModal: PropTypes.func.isRequired,
  isModalOpen: PropTypes.func.isRequired,
  modalData: PropTypes.shape({
    articleId: PropTypes.string
  }).isRequired,
  closeModal: PropTypes.func.isRequired
};
