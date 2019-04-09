import React from "react";
import PropTypes from "prop-types";

import { BottomSheet } from "./BottomSheet";
import { LanguageContext } from "../language_context";

import { ARTICLE_SUMMARY_MODAL_ID } from "../lib/modal_ids";
import { articleContentUrl } from "../lib/urls";
import { ArticleSummaryModal } from "./ArticleSummaryModal";

export class ArticleSummaryModalContainer extends React.Component {
  static onModalClose() {
    document.body.classList.remove("noscroll");
  }

  constructor(props) {
    super(props);

    this.onCloseClick = this.onCloseClick.bind(this);

    props.registerModal(ARTICLE_SUMMARY_MODAL_ID, {
      onOpen: this.onModalOpen.bind(this),
      onClose: ArticleSummaryModalContainer.onModalClose
    });

    this.state = {
      isLoadingArticle: false,
      articleData: null
    };
  }

  async onModalOpen() {
    document.body.classList.add("noscroll");

    const { modalData } = this.props;
    const lang = this.context;

    this.setState({ isLoadingArticle: true });

    try {
      const articleDataResponse = await fetch(
        articleContentUrl(modalData.articleId, lang)
      );
      const articleData = await articleDataResponse.json();
      this.setState({
        isLoadingArticle: false,
        articleData
      });
    } catch (e) {
      this.setState({ isLoadingArticle: false });
    }
  }

  onCloseClick() {
    const { closeModal } = this.props;
    closeModal(ARTICLE_SUMMARY_MODAL_ID);
  }

  render() {
    const { isModalOpen } = this.props;
    const { isLoadingArticle, articleData } = this.state;

    return (
      <BottomSheet
        isOpen={isModalOpen(ARTICLE_SUMMARY_MODAL_ID)}
        onOverlayClick={this.onCloseClick}
      >
        <ArticleSummaryModal
          isLoadingArticle={isLoadingArticle}
          article={articleData}
          onCloseClick={this.onCloseClick}
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
