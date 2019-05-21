import React from "react";
import PropTypes from "prop-types";

import { factPropTypes } from "../lib/prop_types";
import { CoverCardCarousel } from "./CoverCardCarousel";
import { Button } from "./Button";
import { LanguageContext } from "../language_context";
import { ModalContextConsumer } from "./ModalContext";
import { TEAMS_LIST_MODAL_ID } from "../lib/modal_ids";
import { TinyCardsListModalContainer } from "./TinyCardsListModalContainer";
import { LargeSectionTitle } from "./LargeSectionTitle";
import { todayString } from "../lib/date";

const TEAMS_TO_WATCH_MESSAGE = {
  en: "Playing teams",
  hi: "आज खेलने वाली टीमें",
  ta: "TODO"
};

const SEE_ALL_MESSAGE = {
  en: "See all participating teams",
  hi: "सभी भाग लेने वाली टीमें देखें",
  ta: "TODO"
};

const ALL_TEAMS_MESSAGE = {
  en: "All Participating Teams",
  hi: "दिलचस्प टीमें",
  ta: "TODO"
};

export const PlayingTeams = ({ teams, allTeams }) => {
  const dateString = todayString();
  const teamsForToday = teams.filter(f => f.date === dateString);
  return (
    <LanguageContext.Consumer>
      {lang => (
        <section className="wcp-playing-teams">
          <LargeSectionTitle>{TEAMS_TO_WATCH_MESSAGE[lang]}</LargeSectionTitle>
          <CoverCardCarousel cards={teamsForToday} />
          <ModalContextConsumer>
            {({
              openModal,
              closeModal,
              registerModal,
              isModalOpen,
              modalData
            }) => (
              <>
                <Button
                  isInverted
                  onClick={() =>
                    openModal(TEAMS_LIST_MODAL_ID, {
                      items: allTeams,
                      title: ALL_TEAMS_MESSAGE[lang]
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
    </LanguageContext.Consumer>
  );
};

PlayingTeams.defaultProps = {
  teams: [],
  allTeams: []
};

PlayingTeams.propTypes = {
  teams: PropTypes.arrayOf(factPropTypes),
  allTeams: PropTypes.arrayOf(factPropTypes)
};
