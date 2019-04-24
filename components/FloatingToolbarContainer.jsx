import React from "react";

import { ShareModalContainer } from "./ShareModalContainer";

import { ModalContextConsumer } from "./ModalContext";
import { SHARE_MODAL_ID } from "../lib/modal_ids";
import { FloatingToolbar } from "./FloatingToolbar";

export const FloatingToolbarContainer = () => {
  const shareData = process.browser
    ? {
        title: document.title,
        url: window.location.href
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

  return (
    <ModalContextConsumer>
      {({ registerModal, openModal, isModalOpen, modalData, closeModal }) => (
        <>
          <FloatingToolbar onShareClick={onShareClick} openModal={openModal} />
          <ShareModalContainer
            registerModal={registerModal}
            isModalOpen={isModalOpen}
            modalData={modalData}
            closeModal={closeModal}
          />
        </>
      )}
    </ModalContextConsumer>
  );
};
