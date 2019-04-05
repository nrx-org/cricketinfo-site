import React from "react";
import PropTypes from "prop-types";

import { ARTICLE_SUMMARY_MODAL_ID } from "../lib/modal_ids";
import { BottomSheet } from "./BottomSheet";
import { articleUrl } from "../lib/urls";
import { LanguageContext } from "../language_context";

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
        articleUrl(modalData.articleId, lang)
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
    const { isModalOpen, modalData } = this.props;
    const { isLoadingArticle, articleData } = this.state;

    return (
      <BottomSheet
        isOpen={isModalOpen(ARTICLE_SUMMARY_MODAL_ID)}
        close={this.onCloseClick}
      >
        <h1>{modalData && modalData.articleId}</h1>
        <p>{isLoadingArticle}</p>
        <p>{articleData}</p>
        <button type="button" onClick={this.onCloseClick}>
          Close
        </button>
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
