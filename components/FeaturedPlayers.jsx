import React from "react";
import PropTypes from "prop-types";
import { LargeSectionTitle } from "./LargeSectionTitle";
import { LanguageContextConsumer } from "../language_context";
import { todayString } from "../lib/date";
import { AvatarCarousel } from "./AvatarCarousel";
import { Button } from "./Button";
import { factPropTypes } from "../lib/prop_types";
import { TEAMS_LIST_MODAL_ID } from "../lib/modal_ids";
import { ModalContextConsumer } from "./ModalContext";
import { TinyCardsListModalContainer } from "./TinyCardsListModalContainer";

const SECTION_TITLE_MESSAGE = {
  en: "Players to look out for",
  hi: "दिलचस्प खिलाड़ी",
  ta: "TODO"
};

const SEE_ALL_MESSAGE = {
  en: "See all players",
  hi: "सभी खिलाड़ी देखें",
  ta: "TODO"
};

export const FeaturedPlayers = ({ scheduled, constant, all }) => {
  const dateString = todayString();
  const players = [
    ...scheduled.filter(f => f.date === dateString),
    ...constant
  ];

  return (
    <LanguageContextConsumer>
      {lang => (
        <section>
          <LargeSectionTitle>{SECTION_TITLE_MESSAGE[lang]}</LargeSectionTitle>
          <AvatarCarousel cards={players} />
          <ModalContextConsumer>
            {({
              openModal,
              registerModal,
              closeModal,
              isModalOpen,
              modalData
            }) => (
              <>
                <Button
                  isFullWidth
                  isInverted
                  onClick={() =>
                    openModal(TEAMS_LIST_MODAL_ID, {
                      items: all,
                      title: SECTION_TITLE_MESSAGE[lang]
                    })
                  }
                >
                  {SEE_ALL_MESSAGE[lang]}
                </Button>
                <TinyCardsListModalContainer
                  registerModal={registerModal}
                  closeModal={closeModal}
                  isModalOpen={isModalOpen}
                  modalData={modalData}
                />
              </>
            )}
          </ModalContextConsumer>
        </section>
      )}
    </LanguageContextConsumer>
  );
};

FeaturedPlayers.propTypes = {
  scheduled: PropTypes.arrayOf(factPropTypes).isRequired,
  constant: PropTypes.arrayOf(factPropTypes).isRequired,
  all: PropTypes.arrayOf(factPropTypes).isRequired
};
