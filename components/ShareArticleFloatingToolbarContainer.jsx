/* eslint-disable react/jsx-wrap-multilines */

import React from "react";
import PropTypes from "prop-types";
import { useTracking } from "react-tracking";

import { ShareModalContainer } from "./ShareModalContainer";
import { ModalContextConsumer } from "./ModalContext";
import { SHARE_MODAL_ID, WHATSAPP_SUBSCRIBE_MODAL_ID } from "../lib/modal_ids";
import { FloatingToolbar } from "./FloatingToolbar";
import { LanguageContext } from "../language_context";
import { FloatingToolbarButton } from "./FloatingToolbarButton";
import { WhatsAppSubscribeModalContainer } from "./WhatsAppSubscribeModalContainer";
import { articleUiStrings } from "../lib/ui_strings";

import { SAVE_FOR_LATER_CLICK } from "../lib/matomo";

export const ShareArticleFloatingToolbarContainer = ({ articleId }) => {
  const tracking = useTracking();
  const shareData = process.browser
    ? {
        title: document.title,
        url: window.location.href,
        articleId
      }
    : "";

  const onShareClick = (event, openModal) => {
    if (navigator.share) {
      navigator.share(shareData);
    } else {
      event.preventDefault();
      openModal(SHARE_MODAL_ID, shareData);
    }
  };

  const onSaveForLaterClick = (event, openModal) => {
    event.preventDefault();
    openModal(WHATSAPP_SUBSCRIBE_MODAL_ID, shareData);
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
              {}
              <FloatingToolbar
                stickToTop
                leftButton={
                  <FloatingToolbarButton
                    onClick={event => {
                      onSaveForLaterClick(event, openModal);
                      tracking.trackEvent(SAVE_FOR_LATER_CLICK);
                    }}
                    icon={{ name: "bookmark", altText: "Save for later icon" }}
                    label={articleUiStrings.saveForLater[lang]}
                  />
                }
                rightButton={
                  <FloatingToolbarButton
                    onClick={event => {
                      onShareClick(event, openModal);
                    }}
                    icon={{ name: "share", altText: "Share icon" }}
                    label={articleUiStrings.shareArticle[lang]}
                  />
                }
              />
              <ShareModalContainer
                registerModal={registerModal}
                isModalOpen={isModalOpen}
                modalData={modalData}
                closeModal={closeModal}
                lang={lang}
              />
              <WhatsAppSubscribeModalContainer
                registerModal={registerModal}
                isModalOpen={isModalOpen}
                modalData={modalData}
                closeModal={closeModal}
                lang={lang}
              />
            </>
          )}
        </ModalContextConsumer>
      )}
    </LanguageContext.Consumer>
  );
};

ShareArticleFloatingToolbarContainer.propTypes = {
  articleId: PropTypes.string.isRequired
};
