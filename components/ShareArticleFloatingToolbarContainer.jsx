/* eslint-disable react/jsx-wrap-multilines */

import React from "react";
import PropTypes from "prop-types";

import { ShareModalContainer } from "./ShareModalContainer";

import { ModalContextConsumer } from "./ModalContext";
import { SHARE_MODAL_ID, WHATSAPP_SUBSCRIBE_MODAL_ID } from "../lib/modal_ids";
import { FloatingToolbar } from "./FloatingToolbar";
import { LanguageContext } from "../language_context";
import { FloatingToolbarButton } from "./FloatingToolbarButton";
import { WhatsAppSubscribeModalContainer } from "./WhatsAppSubscribeModalContainer";

const SAVE_TEXT = {
  hi: "सेव करें",
  en: "Save for later"
};

const SHARE_TEXT = {
  hi: "लेख शेयर करें",
  en: "Share article"
};

export const ShareArticleFloatingToolbarContainer = ({ articleId }) => {
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
                    onClick={event => onSaveForLaterClick(event, openModal)}
                    icon={{ name: "bookmark", altText: "Save for later icon" }}
                    label={SAVE_TEXT[lang]}
                  />
                }
                rightButton={
                  <FloatingToolbarButton
                    onClick={event => {
                      onShareClick(event, openModal);
                    }}
                    icon={{ name: "share", altText: "Share icon" }}
                    label={SHARE_TEXT[lang]}
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
