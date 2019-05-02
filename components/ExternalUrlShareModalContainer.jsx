import React from "react";
import PropTypes from "prop-types";

import { ShareModalContainer } from "./ShareModalContainer";

import { ModalContextConsumer } from "./ModalContext";
import { SHARE_MODAL_ID } from "../lib/modal_ids";
import { LanguageContext } from "../language_context";

export const ExternalUrlShareModalContainer = props => {
  const { shareData, children, onModalOpen, onModalClose } = props;

  const onShare = (event, openModal) => {
    if (navigator.share) {
      onModalOpen();
      navigator.share(shareData);
    } else {
      event.preventDefault();
      openModal(SHARE_MODAL_ID, shareData);
    }
  };

  return (
    <LanguageContext.Consumer>
      {lang => (
        <ModalContextConsumer>
          {({
            registerModal,
            openModal,
            isModalOpen,
            modalData,
            closeModal
          }) => (
            <>
              <span
                role="presentation"
                onClick={event => {
                  onShare(event, openModal);
                }}
              >
                {children}
              </span>
              <ShareModalContainer
                registerModal={registerModal}
                isModalOpen={isModalOpen}
                modalData={modalData}
                closeModal={closeModal}
                lang={lang}
                onModalOpen={onModalOpen}
                onModalClose={onModalClose}
              />
            </>
          )}
        </ModalContextConsumer>
      )}
    </LanguageContext.Consumer>
  );
};

ExternalUrlShareModalContainer.defaultProps = {
  onModalOpen: null,
  onModalClose: null,
  children: null
};

ExternalUrlShareModalContainer.propTypes = {
  shareData: PropTypes.shape({
    url: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    text: PropTypes.string
  }).isRequired,
  onModalOpen: PropTypes.func,
  onModalClose: PropTypes.func,
  children: PropTypes.node
};
