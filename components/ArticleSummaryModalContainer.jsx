import React from "react";
import PropTypes from "prop-types";

import { BottomSheet } from "./BottomSheet";
import { LanguageContext } from "../language_context";

import { ARTICLE_SUMMARY_MODAL_ID } from "../lib/modal_ids";
import { articleContentUrl } from "../lib/urls";
import { ArticleSummaryModal } from "./ArticleSummaryModal";
import { ERROR_NOT_FOUND, ERROR_NETWORK } from "../lib/errors";

export class ArticleSummaryModalContainer extends React.Component {
  static onModalClose() {
    document.body.classList.remove("noscroll");
  }

  constructor(props) {
    super(props);

    this.onCloseClick = this.onCloseClick.bind(this);
    this.fetchArticleData = this.fetchArticleData.bind(this);

    props.registerModal(ARTICLE_SUMMARY_MODAL_ID, {
      onOpen: this.onModalOpen.bind(this),
      onClose: ArticleSummaryModalContainer.onModalClose
    });

    this.state = {
      isLoading: false,
      error: null,
      data: null
    };
  }

  async onModalOpen() {
    this.fetchArticleData();
  }

  onCloseClick() {
    const { closeModal } = this.props;
    closeModal(ARTICLE_SUMMARY_MODAL_ID);
  }

  async fetchArticleData() {
    document.body.classList.add("noscroll");
    this.setState({ data: null, error: null });

    const { modalData } = this.props;
    const lang = this.context;
    const url = articleContentUrl(modalData.articleId, lang);
    if (url === null) {
      this.setState({ error: ERROR_NOT_FOUND });
      return;
    }
    this.setState({ isLoading: true });

    try {
      const dataResponse = await fetch(url);
      const data = await dataResponse.json();
      this.setState({
        error: null,
        data
      });
    } catch (e) {
      this.setState({ error: ERROR_NETWORK });
    } finally {
      this.setState({ isLoading: false });
    }
  }

  render() {
    const { isModalOpen } = this.props;
    const { isLoading, data, error } = this.state;

    return (
      <BottomSheet
        isOpen={isModalOpen(ARTICLE_SUMMARY_MODAL_ID)}
        onOverlayClick={this.onCloseClick}
      >
        <ArticleSummaryModal
          isLoading={isLoading}
          article={data}
          onCloseClick={this.onCloseClick}
          error={error}
          onRetry={this.fetchArticleData}
        />
      </BottomSheet>
    );
  }
}

ArticleSummaryModalContainer.contextType = LanguageContext;

ArticleSummaryModalContainer.defaultProps = {
  modalData: null
};

ArticleSummaryModalContainer.propTypes = {
  registerModal: PropTypes.func.isRequired,
  isModalOpen: PropTypes.func.isRequired,
  modalData: PropTypes.shape({
    articleId: PropTypes.string
  }),
  closeModal: PropTypes.func.isRequired
};
