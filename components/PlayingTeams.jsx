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
import { homeUiStrings } from "../lib/ui_strings";

export const PlayingTeams = ({ teams, allTeams }) => {
  const dateString = todayString();
  let teamsForToday = teams.filter(f => f.dates.indexOf(dateString) > -1);

  if (teamsForToday.length === 0) {
    teamsForToday = teams.filter(f => f.dates.indexOf("2019-05-31") > -1);
  }

  return (
    <LanguageContext.Consumer>
      {lang => (
        <section className="wcp-playing-teams">
          <LargeSectionTitle>
            {homeUiStrings.playingTeams[lang]}
          </LargeSectionTitle>
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
                      title: homeUiStrings.allParticipatingTeams[lang]
                    })
                  }
                >
                  {homeUiStrings.seeAllParticipatingTeams[lang]}
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
