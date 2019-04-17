import React from "react";

import { IconButton } from "./IconButton";
import { ShareModalContainer } from "./ShareModalContainer";

import { ModalContextConsumer } from "./ModalContext";
import { SHARE_MODAL_ID } from "../lib/modal_ids";

export const ShareIconButtonContainer = () => {
  const ShareData = {
    title: "Things",
    text: "Check out Web Fundamentals — it rocks!",
    url: "https://developers.google.com/web"
  };

  return (
    <ModalContextConsumer>
      {({ registerModal, openModal, isModalOpen, modalData, closeModal }) => (
        <>
          <IconButton
            name="share"
            altText="Share Icon"
            className
            onClick={e => {
              if (navigator.share) {
                navigator
                  .share(ShareData)
                  .then(() => {
                    // TODO
                  })
                  .catch(error => console.log("Error sharing", error));
              } else {
                e.preventDefault();
                openModal(SHARE_MODAL_ID, ShareData);
              }
            }}
          />
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
