import React from "react";

import { ShareModalContainer } from "./ShareModalContainer";

import { ModalContextConsumer } from "./ModalContext";
import { SHARE_MODAL_ID } from "../lib/modal_ids";
import { FloatingToolbar } from "./FloatingToolbar";

export const FloatingToolbarContainer = () => {
  const ShareData = {
    title: "Things",
    text: "Check out Web Fundamentals — it rocks!",
    url: "https://developers.google.com/web"
  };

  const onShareClick = (event, openModal) => {
    if (navigator.share) {
      navigator
        .share(ShareData)
        .then(() => {
          // TODO
        })
        .catch(error => console.log("Error sharing", error));
    } else {
      event.preventDefault();
      openModal(SHARE_MODAL_ID, ShareData);
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
